import axios from "axios";

const api=axios.create({
    baseURL:"http://localhost:3000/api/products",
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