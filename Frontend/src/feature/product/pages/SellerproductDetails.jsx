
import { useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
const SellerproductDetails = () => {
    const { handleFetchProducts } = useProduct();
    const sellerproducts = useSelector((state) => state.product.sellerProducts);

    useEffect(() => {
        handleFetchProducts();
    }, []);



    return (
        <div>SellerproductDetails</div>
    )
}

export default SellerproductDetails