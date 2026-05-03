import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    price: {
        type: Number,
        required: false
    },
    currency: {
        type: String,
        required: false,
        enum: ['USD', 'EUR', 'GBP', 'INR'],
        default: 'USD'
    }


}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    items: [cartItemSchema]
}, {
    timestamps: true
});

const CartModel = mongoose.model('cart', cartSchema);

export default CartModel;
