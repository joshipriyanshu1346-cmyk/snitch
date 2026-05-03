import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/product.api';
import { addToCart } from '../../cart/services/cart.api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        const fetchedProduct = data.product || data;
        setProduct(fetchedProduct);
        if (fetchedProduct.images && fetchedProduct.images.length > 0) {
          setSelectedImage(fetchedProduct.images[0]?.url || fetchedProduct.images[0]);
        } else if (fetchedProduct.image) {
          setSelectedImage(fetchedProduct.image);
        }
        setError('');
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(id, quantity);
      setMessage('Added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setMessage('Failed to add to cart. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FF6B35] rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Loading Details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
          <p className="text-gray-500 mb-6">{error || 'Product not found'}</p>
          <Link to="/" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images.map(img => img.url || img) : (product.image ? [product.image] : []);
  const title = product.title || product.name || 'Untitled Product';
  const price = product.price?.amount || product.price || 0;
  const description = product.description || 'No description available for this product.';

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8 animate-fade-in-up">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-black dark:hover:text-white transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-black dark:text-white font-medium truncate">{title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4 animate-fade-in-up stagger-1">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] relative">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-black dark:border-white' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img src={img} alt={`${title} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col animate-fade-in-up stagger-2 pt-2 lg:pt-8">
            <div className="mb-6">
              {product.isNew && (
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black rounded-lg">
                  New Arrival
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {title}
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
                {product.discount && (
                  <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#FF6B35]/10 text-[#FF6B35] rounded-lg">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {description}
            </p>

            {/* Actions */}
            <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 sm:w-32">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>

              {/* Status Message */}
              {message && (
                <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${
                  message.includes('success') 
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {message}
                </div>
              )}

              {/* Details List */}
              <div className="mt-10 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900 dark:text-white">{product.category || 'Apparel'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">Free standard delivery</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500">Returns</span>
                  <span className="font-medium text-gray-900 dark:text-white">14 days return policy</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
