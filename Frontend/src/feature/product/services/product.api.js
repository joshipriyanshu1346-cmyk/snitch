import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const api=axios.create({
    baseURL:`${API_BASE}/api/products`,
    withCredentials:true
})

export const createProduct=async(form)=>{
    try{
        const response=await api.post("/", form);
        return response.data;
    }
    catch(err){
        console.error("Error creating product:", err);
        throw err;
    }
}

export const getProducts=async()=>{
    try{
        const response=await api.get("/seller");
        return response.data;
    }
    catch(err){
        console.error("Error fetching products:", err);
        throw err;
    }   
}

export const getAllProducts=async()=>{
    try{
        const response=await api.get("/all");
        return response.data;
    }
    catch(err){
        console.error("Error fetching all products:", err);
        throw err;
    }   
}

export const updateProduct=async(productId, form)=>{
    try{
        const response=await api.put(`/${productId}`, form);
        return response.data;
    }
    catch(err){
        console.error("Error updating product:", err);
        throw err;
    }
}

export const deleteProduct=async(productId)=>{
    try{
        const response=await api.delete(`/${productId}`);
        return response.data;
    }
    catch(err){
        console.error("Error deleting product:", err);
        throw err;
    }
}

export const getProductById=async(productId)=>{
    try{
        const response=await api.get(`/${productId}`);
        return response.data;
    }
    catch(err){
        console.error("Error fetching product details:", err);
        throw err;
    }
}