
import { createProduct, getProducts } from '../services/product.api.js';
import { useDispatch } from 'react-redux';
import { setsellerProducts, setProducts } from '../state/product.slice.js';

export const useProduct = () => {
    const dispatch = useDispatch();
    async function handleCreateProduct(form) {
        try {
            const newProduct = await createProduct(form);
            console.log("Product created:", newProduct);
            return newProduct;
        } catch (err) {
            if (err.response) {
                // Log server response for debugging
                console.error("Server responded with an error:", err.response.data);
            } else if (err.request) {
                // Log request details if no response was received
                console.error("No response received:", err.request);
            } else {
                // Log other errors
                console.error("Error creating product:", err.message);
            }
        }
    }

    async function handleFetchProducts() {
       
            const data = await getProducts();
            console.log("Fetched products:", data);
            dispatch(setsellerProducts(data));
            return data;
     
    }

    return {
        handleCreateProduct,
        handleFetchProducts,
    };
};
