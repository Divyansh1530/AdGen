import type { Request, Response } from "express";
import { prisma } from "../../shared/lib/prisma.js";
import cloudinary from "../../integrations/storage/cloudinary.client.js";

export const toggleFavoriteImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const assetId = req.params.assetId as string;

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

    const asset = await prisma.generatedAsset.findFirst({
      where: {
        id: assetId,
        projectId,
        type: "IMAGE",
      },
    });

    if (!asset) {
      res.status(404).json({
        success: false,
        message: "Generated image not found",
      });
      return;
    }

    const updatedAsset = await prisma.$transaction(async (tx) => {
      if (asset.isSelected) {
        return tx.generatedAsset.update({
          where: {
            id: assetId,
          },
          data: {
            isSelected: false,
          },
        });
      }

      await tx.generatedAsset.updateMany({
        where: {
          projectId,
          type: "IMAGE",
          isSelected: true,
        },
        data: {
          isSelected: false,
        },
      });

      return tx.generatedAsset.update({
        where: {
          id: assetId,
        },
        data: {
          isSelected: true,
        },
      });
    });

    res.status(200).json({
      success: true,
      message: updatedAsset.isSelected
        ? "Image added to favorites"
        : "Image removed from favorites",
      data: {
        asset: updatedAsset,
      },
    });
  } catch (error) {
    console.error("Toggle favorite image error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update favorite image",
    });
  }
};

export const deleteGeneratedAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projectId = req.params.projectId as string;
  const assetId = req.params.assetId as string;

  try {
    if (!projectId || !assetId) {
      res.status(400).json({
        success: false,
        message: "Project Id and asset Id are required",
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

    const asset = await prisma.generatedAsset.findFirst({
      where: {
        id: assetId,
        projectId,
      },
      include: {
        derivedVideos: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!asset) {
      res.status(404).json({
        success: false,
        message: "Generated Asset not found",
      });
      return;
    }

    if (asset.type === "IMAGE" && asset.derivedVideos.length > 0) {
      res.status(400).json({
        success: false,
        message: "Cannot delete this image because videos were generated from it",
      });
      return;
    }

    try {
      const url = new URL(asset.url);
      const pathParts = url.pathname.split("/");
      const uploadIndex = pathParts.indexOf("upload");

      if (uploadIndex !== -1) {
        let publicId = pathParts.slice(uploadIndex + 1).join("/");

        if (publicId.startsWith("v")) {
          const firstSlash = publicId.indexOf("/");

          if (firstSlash !== -1) {
            publicId = publicId.substring(firstSlash + 1);
          }
        }
        publicId = publicId.replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId, {
          resource_type: asset.type === "VIDEO" ? "video" : "image",
        });
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);

      res.status(500).json({
        success: false,
        message: "Failed to delete asset from storage",
      });
      return;
    }

    await prisma.generatedAsset.delete({
      where: {
        id: assetId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Generated asset deleted successfully",
    });
  } catch (error) {
    console.error("Delete generated asset error: ", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete generated asset",
    });
  }
};
