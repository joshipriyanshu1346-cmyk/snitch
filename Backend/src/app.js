import express from 'express'
import morgan from 'morgan'
import userRoute from './routes/user.route.js'
import cors from 'cors'
const app=express()
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))

app.use(morgan('dev'))
app.use('/api/auth',userRoute)
export default app