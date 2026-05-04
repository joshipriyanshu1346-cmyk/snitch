import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE}/api/ai`;

export const chatWithAI = async (message, history = []) => {
    try {
        const res = await axios.post(`${API_URL}/chat`, { message, history }, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error("AI Chat API Error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to connect to AI Assistant" };
    }
};
