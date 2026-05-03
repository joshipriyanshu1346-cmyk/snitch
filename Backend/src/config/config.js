import { config } from "dotenv";
config()

export const CONFIG={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT:process.env.IMAGEKIT_URL_ENDPOINT,
    RAZORPAY_KEY_ID:process.env.RAZORPAY_API_KEY,
    RAZORPAY_KEY_SECRET:process.env.RAZORPAY_API_SECRET,
}

    