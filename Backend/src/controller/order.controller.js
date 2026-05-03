import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/order.model.js';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import { CONFIG } from '../config/config.js';

const razorpay = (CONFIG.RAZORPAY_KEY_ID && CONFIG.RAZORPAY_KEY_SECRET) ? new Razorpay({
    key_id: CONFIG.RAZORPAY_KEY_ID,
    key_secret: CONFIG.RAZORPAY_KEY_SECRET,
}) : null;

export const createOrder = async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(500).json({ success: false, message: "Razorpay keys are missing in Backend .env" });
        }
        const user = req.user;
        const { shippingAddress } = req.body;

        // 1. Fetch Cart
        const cart = await CartModel.findOne({ user: user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // 2. Validate Cart & Price
        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            
            // Recalculate based on current DB price to prevent tampering
            const itemPrice = product.price.amount;
            totalAmount += itemPrice * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: itemPrice,
                seller: product.seller
            });
        }

        // Add shipping if applicable (same logic as frontend)
        const shipping = totalAmount > 999 ? 0 : 99;
        const finalAmount = totalAmount + shipping;

        // 3. Create Razorpay Order
        const options = {
            amount: finalAmount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // 4. Create DB Order (Status: CREATED)
        const order = await Order.create({
            user: user._id,
            items: orderItems,
            totalAmount: finalAmount,
            shippingAddress,
            status: 'CREATED',
            razorpayOrderId: razorpayOrder.id
        });

        res.status(201).json({
            success: true,
            order,
            razorpayOrder
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', CONFIG.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment verified
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: 'PAID',
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { new: true }
            );

            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            // Clear Cart
            await CartModel.findOneAndUpdate({ user: order.user }, { items: [] });

            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                orderId: order._id
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Verification Error: " + error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate({
                path: 'items.product',
                model: 'product'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error in getUserOrders:", error);
        res.status(500).json({ success: false, message: "User Orders Error: " + error.message });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id.length !== 24) {
            return res.status(400).json({ success: false, message: "Invalid Order ID" });
        }

        const order = await Order.findById(id).populate({
            path: 'items.product',
            model: 'product'
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error in getOrderDetails:", error);
        res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
    }
};

export const getSellerOrders = async (req, res) => {
    try {
        console.log("Fetching orders for seller:", req.user._id);
        // Find orders that contain products from this seller
        const orders = await Order.find({
            'items.seller': req.user._id
        }).populate({
            path: 'items.product',
            model: 'product'
        }).sort({ createdAt: -1 });

        // Filter items in each order to only show those belonging to the seller
        const sellerOrders = orders.map(order => {
            const orderObj = order.toObject ? order.toObject() : order;
            const filteredItems = orderObj.items.filter(item => 
                item.seller && item.seller.toString() === req.user._id.toString()
            );
            return {
                ...orderObj,
                items: filteredItems
            };
        });

        res.status(200).json({ success: true, orders: sellerOrders });
    } catch (error) {
        console.error("Error in getSellerOrders:", error);
        res.status(500).json({ success: false, message: "Seller Orders Error: " + error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Check if seller owns any items in this order
        const ownsItem = order.items.some(item => item.seller.toString() === req.user._id.toString());
        if (!ownsItem) return res.status(403).json({ success: false, message: "Unauthorized" });

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
