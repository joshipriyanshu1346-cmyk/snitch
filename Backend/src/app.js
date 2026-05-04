import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import userRoute from './routes/user.route.js'
import cors from 'cors'
import productRoute from './routes/product.route.js'
import cartRoute from './routes/cart.route.js'
import orderRoute from './routes/order.route.js'
import aiRoute from './routes/ai.route.js'
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            process.env.FRONTEND_URL || ''
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for now (adjust for production)
        }
    },
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(morgan('dev'))
app.use('/api/auth',userRoute)
app.use('/api/products',productRoute)
app.use('/api/cart',cartRoute)
app.use('/api/order',orderRoute)
app.use('/api/ai',aiRoute)
export default app