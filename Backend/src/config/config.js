import { config } from "dotenv";
config()

export const CONFIG={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
}

    