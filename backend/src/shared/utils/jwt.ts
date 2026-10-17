import jwt , {type SignOptions} from 'jsonwebtoken'

interface JwtPayload {
    userId:string
}

export const generateAccessToken = (userId:string): string => {
    return jwt.sign(
        {userId},
        process.env.JWT_ACCESS_SECRET!,
        {
            expiresIn:process.env.JWT_ACCESS_EXPIRES_IN
        } as SignOptions
    )
}

export const generateRefreshToken = (userId:string):string => {
    return jwt.sign(
        {userId},
        process.env.JWT_REFRESH_SECRET!,
        {
            expiresIn:process.env.JWT_REFRESH_EXPIRES_IN
        } as SignOptions
    )
}

export const verifyAccessToken = (token:string):JwtPayload => {
    return jwt.verify(token,process.env.JWT_ACCESS_SECRET!) as JwtPayload
}

export const verifyRefreshToken = (token:string):JwtPayload => {
    return jwt.verify(token,process.env.JWT_REFRESH_SECRET!) as JwtPayload
}