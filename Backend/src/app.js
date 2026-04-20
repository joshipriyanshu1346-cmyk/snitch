import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import userRoute from './routes/user.route.js'
import cors from 'cors'
import productRoute from './routes/product.route.js'
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))

app.use(morgan('dev'))
app.use('/api/auth',userRoute)
app.use('/api/products',productRoute)
export default app