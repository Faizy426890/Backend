import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';   
// Load environment variables from .env file
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileBuffer) => {
  if (!fileBuffer) {
    throw new Error('File buffer is required');
  }

  return new Promise((resolve, reject) => {
    // Upload the image to Cloudinary using upload_stream
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return reject(error);
      }
      // Resolve with the URL of the uploaded image
      resolve(result.secure_url);
    });

    stream.end(fileBuffer);
  });
};

export { uploadToCloudinary };
