import { CohereClient } from 'cohere-ai';
import ProductModel from "../models/product.model.js";
import CartModel from "../models/cart.model.js";
import Order from "../models/order.model.js";
import { CONFIG } from "../config/config.js";
import Razorpay from "razorpay";

const cohere = new CohereClient({
    token: CONFIG.COHERE_API_KEY,
});

const razorpay = (CONFIG.RAZORPAY_KEY_ID && CONFIG.RAZORPAY_KEY_SECRET) ? new Razorpay({
    key_id: CONFIG.RAZORPAY_KEY_ID,
    key_secret: CONFIG.RAZORPAY_KEY_SECRET,
}) : null;

// Tool Definitions
const listProducts = async ({ category, limit = 5 }) => {
    try {
        const query = category ? { category } : {};
        const products = await ProductModel.find(query).limit(limit);
        return { success: true, products };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const addToCart = async ({ productId, quantity = 1, userId }) => {
    try {
        let cart = await CartModel.findOne({ user: userId });
        if (!cart) cart = await CartModel.create({ user: userId, items: [] });
        
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        return { success: true, message: "Added to cart successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getCart = async ({ userId }) => {
    try {
        const cart = await CartModel.findOne({ user: userId }).populate('items.product');
        return { success: true, cart };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const trackOrder = async ({ userId }) => {
    try {
        const orders = await Order.find({ user: userId }).populate('items.product').sort({ createdAt: -1 }).limit(1);
        if (orders.length === 0) return { success: false, message: "No orders found" };
        return { success: true, order: orders[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const initiateCheckout = async ({ userId, shippingAddress }) => {
    try {
        if (!razorpay) return { success: false, message: "Razorpay not configured on server" };
        
        // Handle shippingAddress if it comes as a string from AI
        let addr = shippingAddress;
        if (typeof addr === 'string') {
            try { addr = JSON.parse(addr); } catch(e) {
                return { success: false, message: "Please provide shipping address in a clear format (Name, Address, City, Pincode, Phone)." };
            }
        }

        if (!addr || !addr.fullName) return { success: false, message: "Shipping address details are incomplete." };

        const cart = await CartModel.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) return { success: false, message: "Your cart is empty" };

        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;
            if (!product) continue;
            const itemPrice = product.price.amount;
            totalAmount += itemPrice * item.quantity;
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: itemPrice,
                seller: product.seller
            });
        }

        const shipping = totalAmount > 999 ? 0 : 99;
        const finalAmount = totalAmount + shipping;

        const options = {
            amount: finalAmount * 100,
            currency: "INR",
            receipt: `receipt_ai_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount: finalAmount,
            shippingAddress: addr,
            status: 'CREATED',
            razorpayOrderId: razorpayOrder.id
        });

        return { 
            success: true, 
            triggerAction: "RAZORPAY_POPUP", 
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: finalAmount,
            currency: "INR",
            shippingAddress: addr
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const chatWithAI = async (req, res) => {
    const { message, history } = req.body;
    const userId = req.user._id;

    if (!CONFIG.COHERE_API_KEY) {
        return res.status(500).json({ success: false, message: "Cohere API key is not configured." });
    }

    try {
        const tools = [
            {
                name: "listProducts",
                description: "List available products in the store",
                parameterDefinitions: {
                    category: { type: "string", description: "Product category", required: false },
                    limit: { type: "number", description: "Number of products", required: false }
                }
            },
            {
                name: "addToCart",
                description: "Add a product to the shopping cart",
                parameterDefinitions: {
                    productId: { type: "string", description: "The ID of the product", required: true },
                    quantity: { type: "number", description: "Quantity", required: false }
                }
            },
            {
                name: "getCart",
                description: "Get current cart contents",
                parameterDefinitions: {}
            },
            {
                name: "trackOrder",
                description: "Track latest order status",
                parameterDefinitions: {}
            },
            {
                name: "initiateCheckout",
                description: "Start checkout and payment process",
                parameterDefinitions: {
                    fullName: { type: "string", description: "Full name", required: true },
                    address: { type: "string", description: "Shipping address", required: true },
                    city: { type: "string", description: "City", required: true },
                    postalCode: { type: "string", description: "Postal code", required: true },
                    phone: { type: "string", description: "Phone number", required: true }
                }
            }
        ];

        // Format history for Cohere
        const chatHistory = (history || [])
            .filter(msg => msg.parts?.[0]?.text)
            .map(msg => ({
                role: msg.role === 'model' ? 'CHATBOT' : 'USER',
                message: msg.parts[0].text
            }));

        const chatResponse = await cohere.chat({
            message,
            model: 'command-r-plus-08-2024', // Latest supported model
            chatHistory,
            tools,
            preamble: "You are the SNITCH AI Assistant, a premium personal shopper for SNITCH (Luxury E-commerce). Help users browse, manage cart, track orders, and checkout. Be sophisticated, concise, and helpful. If a user wants to checkout, ask for their shipping address details if not provided."
        });

        console.log("Cohere Response:", JSON.stringify(chatResponse, null, 2));

        let finalResponse = chatResponse;
        let finalToolResult = null;

        if (chatResponse.toolCalls && chatResponse.toolCalls.length > 0) {
            const toolCall = chatResponse.toolCalls[0];
            const args = { ...toolCall.parameters, userId };
            
            console.log(`Executing tool: ${toolCall.name}`, args);

            let toolResult;
            try {
                switch (toolCall.name) {
                    case "listProducts": toolResult = await listProducts(args); break;
                    case "addToCart": toolResult = await addToCart(args); break;
                    case "getCart": toolResult = await getCart(args); break;
                    case "trackOrder": toolResult = await trackOrder(args); break;
                    case "initiateCheckout": 
                    const shippingAddress = {
                        fullName: args.fullName,
                        address: args.address,
                        city: args.city,
                        postalCode: args.postalCode,
                        phone: args.phone,
                        country: "India" // Default
                    };
                    toolResult = await initiateCheckout({ userId, shippingAddress }); 
                    break;
                    default: toolResult = { success: false, message: "Tool not found" };
                }
            } catch (toolError) {
                console.error("Tool execution error:", toolError);
                toolResult = { success: false, message: toolError.message };
            }

            finalToolResult = toolResult;

            // Get final verbal response from Cohere with tool results
            finalResponse = await cohere.chat({
                message: "Tool execution finished. Here is the result.",
                model: 'command-r-plus-08-2024',
                chatHistory: [...chatHistory, { role: "USER", message }],
                toolResults: [
                    {
                        call: toolCall,
                        outputs: [toolResult]
                    }
                ]
            });
        }

        res.status(200).json({ 
            success: true, 
            message: finalResponse.text,
            history: [
                ...(history || []),
                { role: 'user', parts: [{ text: message }] },
                { role: 'model', parts: [{ text: finalResponse.text }] }
            ],
            action: finalToolResult?.triggerAction ? finalToolResult : null
        });

    } catch (error) {
        console.error("Cohere AI Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "An error occurred with the AI Assistant.",
            errorDetails: error
        });
    }
};
