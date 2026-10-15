import cloudinary from "../lib/cloudinary.ts";
import type{ UploadApiResponse } from "cloudinary";

export const uploadOnCloudinary = (
  buffer: Buffer,
  folder: string,
  resourceType:"image" | "video" = "image"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};