import express from 'express'
import morgan from 'morgan'
import userRoute from './routes/user.route.js'
const app=express()
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/auth',userRoute)
export default app