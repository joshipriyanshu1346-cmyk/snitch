import express from 'express';
import { AuthMiddleware,Authsellermiddleware } from '../middleware/auth.middleware.js';
import { createProduct,getProducts } from '../controller/product.controller.js';
import { validateProduct } from '../validator/product.validator.js';
import multer from 'multer';

// const upload=multer({
//     storage:multer.memoryStorage(),
//     limits:
//     {
//         fileSize:5*1024*1024
//     } // 5MB file size limit

// });

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post('/',Authsellermiddleware,upload.array('images',7), validateProduct(), createProduct);
router.get('/seller',Authsellermiddleware,getProducts);

export default router;
