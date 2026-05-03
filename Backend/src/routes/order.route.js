import express from 'express';
import { createOrder, verifyPayment, getUserOrders, getOrderDetails, getSellerOrders, updateOrderStatus } from '../controller/order.controller.js';
import { AuthMiddleware, Authsellermiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', AuthMiddleware, createOrder);
router.post('/verify', AuthMiddleware, verifyPayment);
router.get('/my-orders', AuthMiddleware, getUserOrders);
router.get('/:id', AuthMiddleware, getOrderDetails);

// Seller routes
router.get('/seller/orders', Authsellermiddleware, getSellerOrders);
router.put('/status/:orderId', Authsellermiddleware, updateOrderStatus);

export default router;
