import { v2 as cloudinary } from 'cloudinary'; 
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});   

const uploadToCloudinary = async (filepath) => { 
    try { 
        if (!filepath) {
            throw new Error('Filepath is required');
        }

        const response = await cloudinary.uploader.upload(filepath);


        // Delete the file from the local filesystem after upload
        fs.unlinkSync(filepath);

        return response;
    } catch (error) { 
        console.error('Error uploading to Cloudinary:', error);

        // Ensure the file is deleted in case of an error as well
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        throw error; // Re-throw the error so it can be handled by the caller
    }
}

export { uploadToCloudinary };
