import {Router} from 'express'
import {registerValidation,loginValidation} from '../validator/auth.validator.js'
import { registerUser,loginUser,getMe } from '../controller/auth.controller.js'


const router=Router()

router.post('/register', registerValidation, registerUser)

router.post('/login', loginValidation, loginUser)

router.get('/getMe',getMe)

export default router