import mongoose from 'mongoose'
import { CONFIG } from './config.js'

const connectDB = async () => {
    try {
        await mongoose.connect(CONFIG.MONGO_URI)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

export default connectDB