import express from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { chatWithAI } from '../controller/ai.controller.js';

const router = express.Router();

router.post('/chat', AuthMiddleware, chatWithAI);

export default router;
