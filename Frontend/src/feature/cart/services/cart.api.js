import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const api = axios.create({
    baseURL: `${API_BASE}/api/cart`,
    withCredentials: true
});

export const getCart = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (err) {
        console.error("Error fetching cart:", err);
        throw err;
    }
};

export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await api.post("/", { productId, quantity });
        window.dispatchEvent(new Event('cartUpdated'));
        return response.data;
    } catch (err) {
        console.error("Error adding to cart:", err);
        throw err;
    }
};

export const removeFromCart = async (productId) => {
    try {
        const response = await api.delete(`/${productId}`);
        window.dispatchEvent(new Event('cartUpdated'));
        return response.data;
    } catch (err) {
        console.error("Error removing from cart:", err);
        throw err;
    }
};

export const updateCartQuantity = async (productId, quantity) => {
    try {
        const response = await api.put(`/${productId}`, { quantity });
        window.dispatchEvent(new Event('cartUpdated'));
        return response.data;
    } catch (err) {
        console.error("Error updating cart quantity:", err);
        throw err;
    }
};

export const clearCart = async () => {
    try {
        const response = await api.delete("/clear/all");
        window.dispatchEvent(new Event('cartUpdated'));
        return response.data;
    } catch (err) {
        console.error("Error clearing cart:", err);
        throw err;
    }
};
