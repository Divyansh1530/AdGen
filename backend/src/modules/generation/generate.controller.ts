import type { Request, Response } from "express";
import { prisma } from "../../shared/lib/prisma.js";
import imageProvider from "../../integrations/providers/image-provider.js";
import videoProvider from "../../integrations/providers/video-provider.js"
import { uploadOnCloudinary } from "../../integrations/storage/storage.service.js";
import { deductCredits, refundCredits } from "../credits/credit.service.js";

export const generateProjectImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const IMAGE_GENERATION_COST = 3;
  const projectId = req.params.projectId as string;
  let creditsDeducted = false;
  try {
    if (!projectId) {
      res.status(400).json({
        success: false,
        message: "Project Id is required",
      });
      return;
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId,
      },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    if (!project.productImageUrl || !project.modelImageUrl) {
      res.status(400).json({
        success: false,
        message: "Please upload both product and model image",
      });
      return;
    }

    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: "GENERATING_IMAGE",
        errorMessage: null,
      },
    });

    await deductCredits(
      req.userId,
      IMAGE_GENERATION_COST,
      "IMAGE_GENERATION",
      `Generated images for project ${projectId}`
    );

    creditsDeducted = true;

    const generatedImages = await imageProvider.generateImages({
      productImageUrl: project.productImageUrl,
      modelImageUrl: project.modelImageUrl,
      productName: project.productName,
      productDescription: project.productDescription,
      userPrompt: project.userPrompt,
      aspectRatio: project.aspectRatio,
    });

    if (generatedImages.length === 0) {
      throw new Error("Image provider returned no image");
    }

    const assets = [];

    for (const image of generatedImages) {
      const uploadResult = await uploadOnCloudinary(
        image.buffer,
        `adgen/projects/${projectId}`
      );
      const asset = await prisma.generatedAsset.create({
        data: {
          projectId,
          type: "IMAGE",
          url: uploadResult.secure_url,
        },
      });

      assets.push(asset);
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: "IMAGE_GENERATED",
        errorMessage: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Images Generated Successfully",
      data: {
        project: updatedProject,
        assets,
      },
    });
  } catch (error) {
    console.error("Generate Project Images Error: ", error);

    if (creditsDeducted) {
      try {
        await refundCredits(
          req.userId,
          IMAGE_GENERATION_COST,
          `Refund for failed image generation for project ${projectId}`
        );
      } catch (refundError) {
        console.error("Failed to refund credits:", refundError);
      }
    }

    try {
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          status: "FAILED",
          errorMessage:
            error instanceof Error ? error.message : "Image generation failed",
        },
      });
    } catch (updateError) {
      console.error("Failed to update project status:", updateError);
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const generateVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projectId = req.params.projectId as string;
  const assetId = req.params.assetId as string;
  const VIDEO_GENERATION_COST = 5;
  let creditsDeducted = false;
  try {
    if (!projectId || !assetId) {
      res.status(400).json({
        success: false,
        message: "Project ID and asset ID are required",
      });
      return;
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId,
      },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const sourceImage = await prisma.generatedAsset.findFirst({
      where: {
        id: assetId,
        projectId,
        type: "IMAGE",
      },
    });

    if (!sourceImage) {
      res.status(404).json({
        success: false,
        message: "Generated image not found",
      });
      return;
    }

    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: "GENERATING_VIDEO",
        errorMessage: null,
      },
    });

    // Deduct credits
    await deductCredits(
      req.userId,
      VIDEO_GENERATION_COST,
      "VIDEO_GENERATION",
      `Generated videos for project ${projectId}`
    );

    creditsDeducted = true;

    const generatedVideo = await videoProvider.generateVideo({
      imageUrl: sourceImage.url,
    });

    if (!generatedVideo?.buffer) {
      throw new Error("Video provider returned no video");
    }

    // Upload video to Cloudinary
    const uploadResult = await uploadOnCloudinary(
      generatedVideo.buffer,
      `adgen/projects/${projectId}/videos`,
      "video"
    );

    // Create GeneratedAsset for the video
    const videoAsset = await prisma.generatedAsset.create({
      data: {
        projectId,
        type: "VIDEO",
        url: uploadResult.secure_url,
        sourceAssetId: sourceImage.id,
        status: "READY",
      },
    });

    // Update project status
    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: "COMPLETED",
        errorMessage: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Video generated successfully",
      data: {
        video: videoAsset,
      },
    });
  } catch (error) {
    console.error("Generate video error:", error);

    if (creditsDeducted) {
      try {
        await refundCredits(
          req.userId,
          VIDEO_GENERATION_COST,
          `Refund for failed video generation for project ${projectId}`
        );
      } catch (refundError) {
        console.error("Failed to refund credits:", refundError);
      }
    }

    // Try to mark project as failed
    try {
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          status: "FAILED",
          errorMessage:
            error instanceof Error ? error.message : "Video generation failed",
        },
      });
    } catch (updateError) {
      console.error("Failed to update project status:", updateError);
    }

    res.status(500).json({
      success: false,
      message: "Video generation failed",
    });
  }
}

export const getGenerations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;

    if (!projectId) {
      res.status(400).json({
        success: false,
        message: "Project Id is required",
      });
      return;
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId,
      },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const assets = await prisma.generatedAsset.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sourceAsset: {
          select: {
            id: true,
            type: true,
            url: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Generations Fetched Successfully",
      data: {
        assets,
      },
    });
  } catch (error) {
    console.error("Get Generations Error: ", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch generations",
    });
  }
};

