import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import logger from '../logger/winston.logger';
import ApiError from './ApiError';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (fileBuffer: Buffer, folderName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `MBZ/${folderName}`, // Malik Brand Zone folder structure
        format: 'webp', // Auto convert to modern format
        quality: 'auto',
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary Upload Error: ${error.message}`);
          return reject(new ApiError(500, 'Image upload failed'));
        }
        if (result) {
          resolve(result.secure_url);
        }
      }
    );

    // Write buffer to the stream
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error(`Cloudinary Delete Error: ${(error as Error).message}`);
  }
};