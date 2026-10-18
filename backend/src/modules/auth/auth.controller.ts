import {prisma} from '../../shared/lib/prisma.js'
import type{ Request,Response } from 'express';
import { comparePassword,hashPassword } from '../../shared/utils/password.js';
import { generateAccessToken,generateRefreshToken,verifyRefreshToken} from '../../shared/utils/jwt.js';
import { hashToken } from '../../shared/utils/token.js';
import type{ CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === "production";

const options: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
};

export const registerUser = async(req:Request,res:Response):Promise<void> => {
    try {
        const {name , email , password} = req.body

        if (!email || !password) {
            res.status(400).json({
                success:false,
                message:"Email and Password are required"
            })
            return 
        }

        if (password.length < 8) {
            res.status(400).json({
                success:false,
                message:"Password must be atleast 8 characters"
            })
            return
        }

        const normalizedEmail = email.trim().toLowerCase()

        const existingUser = await prisma.user.findUnique({
            where: {email:normalizedEmail}
        })

        if (existingUser) {
            res.status(409).json({
                success:false,
                message:"User with this email already exists"
            })
            return
        }

        const passwordHash = await hashPassword(password)

        const user = await prisma.user.create({
            data:{
                name: name?.trim() || normalizedEmail.split('@')[0] || "User",
                email: normalizedEmail,
                passwordHash
            }
        })

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        const refreshTokenHash = hashToken(refreshToken);

            await prisma.refreshToken.create({
                data: {
                    userId: user.id,
                    tokenHash: refreshTokenHash,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

        res.cookie("accessToken",accessToken,options)
        res.cookie("refreshToken",refreshToken,options)
        res.status(201).json({
            success:true,
            message:"User Registered Successfully",
            data:{
                user:{
                    id:user.id,
                    name:user.name,
                    email:user.email,
                    credits:user.credits
                },
            }
        })

    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const loginUser = async(req:Request,res:Response):Promise<void> => {
    try {
        const {email , password} = req.body
    
        if (!email || !password) {
            res.status(400).json({
                success:false,
                message:"Email and Password are required"
            })
            return
        }
    
        const normalizedEmail = email.trim().toLowerCase()
    
        const user = await prisma.user.findUnique({
            where:{
                email:normalizedEmail
            }
        })
    
        if (!user) {
            res.status(404).json({
                success:false,
                message:"User not found"
            })
            return
        }
    
        const isPasswordValid = await comparePassword(password,user.passwordHash)
    
        if (!isPasswordValid) {
            res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
            return
        }
        
        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)
    
        const refreshTokenHash = hashToken(refreshToken) 
    
         await prisma.refreshToken.create({
          data: {
            userId: user.id,
            tokenHash: refreshTokenHash,
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ),
            userAgent: req.headers["user-agent"] || null,
            ipAddress: req.ip || null,
          },
        });
        
        res.cookie("refreshToken",refreshToken,options)
        res.cookie("accessToken",accessToken,options)
        res.status(200).json({
          success: true,
          message: "Login successful",
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              credits: user.credits,
            }
          },
        })

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export const getCurrentUser = async (req: Request,res: Response):Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        credits: true, 
        createdAt: true 
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
  
    res.status(200).json({
      success: true,
      data: user,
    })

  } catch (error) {
    console.error("Get Current User: ",error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
  }
}

export const refreshAccessToken = async (req:Request,res:Response):Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken
    
        if (!refreshToken) {
            res.status(401).json({
                success:false,
                message:"Refresh token is required"
            })
            return
        }
    
        let payload
        try {
            payload = verifyRefreshToken(refreshToken)
        } catch (error) {
            res.status(401).json({
                success:false,
                message:"Invalid or expired refresh token"
            })
            return
        }
    
        const tokenHash = hashToken(refreshToken)
        const storedToken = await prisma.refreshToken.findUnique({
            where:{
                tokenHash
            }
        })
    
        if (!storedToken) {
            res.status(401).json({
                success:false,
                message:"Refresh token not found"
            })
            return
        }
    
        if (storedToken.revoked){
            res.status(401).json({
                success:false,
                message:"Refresh token has been revoked"
            })
            return
        }
    
        if (storedToken.expiresAt <= new Date()){
            res.status(401).json({
                success:false,
                message:"Refresh token has expired"
            })
            return
        }
    
        const newAccessToken = generateAccessToken(storedToken.userId)
        const newRefreshToken = generateRefreshToken(storedToken.userId)
    
        const newRefreshTokenHash = hashToken(newRefreshToken)
    
        await prisma.$transaction(async(tx) => {
            await tx.refreshToken.update({
                where:{
                    id:storedToken.id
                },
                data:{
                    revoked:true
                }
            })
            
             await tx.refreshToken.create({
                data: {
                    userId: storedToken.userId,
                    tokenHash: newRefreshTokenHash,
                    expiresAt: new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                    ),
                    userAgent: req.headers["user-agent"] || null,
                    ipAddress: req.ip || null,
                },
          })
        })

            res.cookie("refreshToken", newRefreshToken, options)
            res.cookie("accessToken", newAccessToken, options)
            res.status(200).json({
                success: true,
                message: "Access token refreshed successfully",
            })
         } catch (error) {
            console.error("Refresh token error:", error)

            res.status(500).json({
                success:false,
                message:"Internal Server Error"
            })
        }
}

export const logoutUser = async (req:Request,res:Response):Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (refreshToken) {
            const tokenHash = hashToken(refreshToken)
            await prisma.refreshToken.updateMany({
                where:{
                    tokenHash,
                    revoked:false
                },
                data:{
                    revoked:true
                }
            })
        }

        res.clearCookie("refreshToken",options)
        res.clearCookie("accessToken",options)
        res.status(200).json({
            success:true,
            message:"Logged out successfully"
        })

    } catch (error) {
        console.error("Logout error:" , error)

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
