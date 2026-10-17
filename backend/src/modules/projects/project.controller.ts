import type{ Request,Response } from "express"
import {prisma} from '../../shared/lib/prisma.js'
import { uploadOnCloudinary } from "../../integrations/storage/storage.service.js"
import cloudinary from "../../integrations/storage/cloudinary.client.js"

const extractCloudinaryPublicId = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const uploadIndex = pathParts.indexOf("upload");
    if (uploadIndex === -1) return null;

    let publicId = pathParts.slice(uploadIndex + 1).join("/");
    if (publicId.startsWith("v")) {
      const firstSlash = publicId.indexOf("/");
      if (firstSlash !== -1) {
        publicId = publicId.substring(firstSlash + 1);
      }
    }
    return publicId.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

export const createProject = async(req:Request,res:Response):Promise<void> => {
    try {
        const {name , productName , productDescription , userPrompt , aspectRatio} = req.body

        if (!name || !productName) {
            res.status(400).json({
                success:false,
                message:"Project name and product name are required"
            })
            return
        }

        const project = await prisma.project.create({
            data:{
                userId:req.userId,
                name:name.trim(),
                productName:productName.trim(),
                productDescription:productDescription?.trim() || null,
                userPrompt:userPrompt?.trim() || null,
                aspectRatio:aspectRatio || "PORTRAIT_9_16",

                productImageUrl:"",
                modelImageUrl:""
            }
        })

        res.status(201).json({
            success:true,
            message:"Project Created successfully",
            data:{
                project
            }
        })

    } catch (error) {
        console.error("Create Project Error: ", error)

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const getProjects = async(req:Request,res:Response):Promise<void> => {
    try {
        const projects = await prisma.project.findMany({
            where:{
                userId:req.userId
            },
            include:{
                generatedAssets:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
    
        res.status(200).json({
            success:true,
            message:"Projects Fetched Successfully",
            data:{
                projects
            }
        })
    } catch (error) {
        console.error("Get Projects Error: ",error)

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const getProjectById = async(req:Request,res:Response):Promise<void> => {
    try {
        const projectId = req.params.projectId as string
    
        if (!projectId) {
            res.status(400).json({
                success:false,
                message:"Project Id is required"
            })
            return
        }
    
        const project = await prisma.project.findFirst({
            where:{
                id:projectId,
                userId:req.userId
            },
            include:{
                generatedAssets:true
            }
        })
    
        if (!project) {
            res.status(404).json({
                success:false,
                message:"Project not found"
            })
            return
        }
    
        res.status(200).json({
            success:true,
            message:"Project fetched successfully",
            data:{
                project
            }
        })
    } catch (error) {
        console.error("Get Project By Id Error: ",error)

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const updateProject = async(req:Request,res:Response):Promise<void> => {
    try {
        const projectId = req.params.projectId as string
    
        if (!projectId) {
            res.status(400).json({
                success:false,
                message:"Project Id is required"
            })
            return
        }
    
        const {name, productName , productDescription , userPrompt , aspectRatio} = req.body
    
        const existingProject = await prisma.project.findFirst({
            where:{
                id:projectId,
                userId:req.userId
            }
        })
    
        if (!existingProject) {
            res.status(404).json({
                success:false,
                message:"Project not found"
            })
            return
        }
    
        const data : {
            name?: string;
            productName?: string;
            productDescription?:string | null;
            userPrompt?:string | null;
            aspectRatio?:typeof existingProject.aspectRatio;
        } = {}
    
        if (name !== undefined) {
            data.name = name.trim(); 
        }
    
        if (productName !== undefined) {
            data.productName = productName.trim(); 
        }
    
         if (productDescription !== undefined) {
          data.productDescription = productDescription?.trim() || null;
        }
    
        if (userPrompt !== undefined) {
          data.userPrompt = userPrompt?.trim() || null;
        }
    
        if (aspectRatio !== undefined) {
          data.aspectRatio = aspectRatio;
        }
    
        const updatedProject = await prisma.project.update({
            where:{
                id:projectId
            },
            data
        })
    
        res.status(200).json({
            success:true,
            message:"Project Updated Successfully",
            data:{
                updatedProject
            }
        })
    } catch (error) {
        console.error("Update Project: ",error)

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const deleteProject = async (req:Request,res:Response):Promise<void> => {
  try {
    const projectId = req.params.projectId as string;

    if (!projectId) {
      res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
      return;
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId,
      },
      include: {
        generatedAssets: true,
      },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

     // Clean up all Cloudinary assets associated with this project
    const deletionPromises: Promise<unknown>[] = [];

    const productPublicId = extractCloudinaryPublicId(project.productImageUrl);
    if (productPublicId) {
      deletionPromises.push(
        cloudinary.uploader.destroy(productPublicId, { resource_type: "image" }).catch((err) => {
          console.warn(`Failed to delete product image ${productPublicId}:`, err);
        })
      );
    }

    const modelPublicId = extractCloudinaryPublicId(project.modelImageUrl);
    if (modelPublicId) {
      deletionPromises.push(
        cloudinary.uploader.destroy(modelPublicId, { resource_type: "image" }).catch((err) => {
          console.warn(`Failed to delete model image ${modelPublicId}:`, err);
        })
      );
    }

    for (const asset of project.generatedAssets) {
      const assetPublicId = extractCloudinaryPublicId(asset.url);
      if (assetPublicId) {
        deletionPromises.push(
          cloudinary.uploader.destroy(assetPublicId, {
            resource_type: asset.type === "VIDEO" ? "video" : "image",
          }).catch((err) => {
            console.warn(`Failed to delete asset ${assetPublicId}:`, err);
          })
        );
      }
    }

    await Promise.allSettled(deletionPromises);

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const uploadProjectImages = async (req:Request,res:Response):Promise<void> => {
    try {
        const projectId = req.params.projectId as string

        if (!projectId) {
            res.status(400).json({
                success:false,
                message:"Project Id is required"
            })
            return
        }

        const project = await prisma.project.findFirst({
            where:{
                id:projectId,
                userId:req.userId
            }
        })

        if (!project) {
            res.status(404).json({
                success:false,
                message:"Project not found"
            })
            return
        }

        const files = req.files as {
            [fieldname:string]: Express.Multer.File[]
        }
        
        const productImage = files?.productImage?.[0]
        const modelImage = files?.modelImage?.[0]

        if (!productImage || !modelImage) {
            res.status(400).json({
                success:false,
                message:"Both Product and Model image are required"
            })
            return
        }

        const productUpload = await uploadOnCloudinary(
            productImage.buffer,
            "adgen/projects"
        )

        const modelUpload = await uploadOnCloudinary(
            modelImage.buffer,
            "adgen/projects"
        )

        const updatedProject = await prisma.project.update({
            where:{
                id:projectId
            },
            data:{
                productImageUrl:productUpload.secure_url,
                modelImageUrl:modelUpload.secure_url
            }
        })

        res.status(200).json({
            success:true,
            message:"Project images uploaded successfully",
            data:{
                project:updatedProject
            }
        })

    } catch (error) {
        console.error("Upload Project Images Error ",error)

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}