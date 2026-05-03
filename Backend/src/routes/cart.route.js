import express from 'express';
import { Authsellermiddleware } from '../middleware/auth.middleware.js';
import { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart 
} from '../controller/cart.controller.js';

const router = express.Router();

router.get('/', Authsellermiddleware, getCart);
router.post('/', Authsellermiddleware, addToCart);
router.delete('/:productId', Authsellermiddleware, removeFromCart);
router.put('/:productId', Authsellermiddleware, updateCartQuantity);
router.delete('/clear/all', Authsellermiddleware, clearCart);

export default router;
