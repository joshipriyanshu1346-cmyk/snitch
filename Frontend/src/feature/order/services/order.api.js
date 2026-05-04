import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE}/api/order`;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export const createOrder = async (orderData) => {
    const response = await api.post('/create', orderData);
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/verify', paymentData);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await api.get('/my-orders');
    return response.data;
};

export const getOrderDetails = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const getSellerOrders = async () => {
    const response = await api.get('/seller/orders');
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await api.put(`/status/${orderId}`, { status });
    return response.data;
};
