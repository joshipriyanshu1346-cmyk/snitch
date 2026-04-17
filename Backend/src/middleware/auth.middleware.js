import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'
import Usermodel from '../models/user.model.js'
export const AuthMiddleware=(req,res,next)=>{

        const token=req.cookies.token
        if(!token){
            return res.status(401).json({message:'Unauthorized'})
        }
        try {
            const decoded=jwt.verify(token,config.JWT_SECRET)

            const user=Usermodel.findById(decoded.id)
            if(!user){
                return res.status(401).json({message:'Unauthorized'})
            }

            if(user.role != "seller"){
                return res.status(403).json({message:'Forbidden'})
        }
            req.user=user
            next()
        } catch (error) {
            return res.status(401).json({message:'Unauthorized'})
        }

}