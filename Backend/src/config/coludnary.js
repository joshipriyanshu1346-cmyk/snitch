import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.COLUDNARY_CLOUD_NAME,
  api_key: process.env.COLUDNARY_API_KEY,
  api_secret: process.env.COLUDNARY_SECERT,
});
