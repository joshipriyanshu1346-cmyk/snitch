import axios from 'axios';

const API_URL = 'http://localhost:3000/api/order';

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
