import mongoose from 'mongoose';
import multer from 'multer';
import cloudinary from 'cloudinary';

export const dbConnect = async () => {
  const mongodbUri = process.env.MONGODB_URI;
  if (mongodbUri) {
    try {
      mongoose.connect(mongodbUri);
      console.log('✅ mongodb connection');
    } catch (error) {
      console.error('mongoose connection error', error);
    }
  }
};

mongoose.connection.on('connect', () => console.log('🟢 mongodb server connected'));
mongoose.connection.on('disconnect', () => console.log('🔴 mongodb server disconnected'));

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadFile = multer({ storage: multer.memoryStorage() });
