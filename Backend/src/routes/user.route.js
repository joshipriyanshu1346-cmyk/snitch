import {Router} from 'express'
import { registerValidation, loginValidation } from '../validator/auth.validator.js'
import { registerUser, loginUser, getMe, updateProfile, toggleFavorite, getFavorites } from '../controller/auth.controller.js'
import { AuthMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', registerValidation, registerUser)
router.post('/login', loginValidation, loginUser)
router.get('/getMe', AuthMiddleware, getMe)
router.put('/update', AuthMiddleware, updateProfile)
router.post('/favorites/toggle', AuthMiddleware, toggleFavorite)
router.get('/favorites', AuthMiddleware, getFavorites)

export default router