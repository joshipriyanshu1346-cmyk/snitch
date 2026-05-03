import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCart, removeFromCart, updateCartQuantity } from '../services/cart.api';
import { createOrder, verifyPayment } from '../../order/services/order.api';

const Cart = () => {
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      // 1. Create Order on Backend
      const orderData = {
        shippingAddress: {
          fullName: "User Name", // Should be collected from a form, using placeholder for now
          address: "123 Main St",
          city: "Bangalore",
          postalCode: "560001",
          country: "India",
          phone: "9876543210"
        }
      };

      const res = await createOrder(orderData);
      
      if (res.success) {
        const { razorpayOrder, order } = res;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SkVCVCdqmnE9bO',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "SNITCH",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              console.log("Payment successful, verifying...", response);
              const verifyRes = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.success) {
                navigate(`/order/success/${verifyRes.orderId}`);
              } else {
                alert("Payment verification failed: " + verifyRes.message);
              }
            } catch (err) {
              console.error("Verification failed", err);
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: user?.fullname || "User Name",
            email: user?.email || "user@example.com",
            contact: user?.contact || "9876543210"
          },
          theme: {
            color: "#FF6B35"
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
                console.error("Payment failed event", response.error);
                alert("Payment Failed: " + response.error.description);
        });
        rzp.open();
      } else {
        setError(res.message || "Failed to initiate checkout");
      }
    } catch (err) {
      console.error("Checkout failed", err);
      const msg = err.response?.data?.message || "Checkout failed. Please ensure you are logged in.";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setItems(data.cart?.items || []);
      setError('');
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, delta) => {
    const currentItem = items.find(item => item.product._id === productId);
    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + delta);

    try {
      await updateCartQuantity(productId, newQuantity);
      setItems((prev) =>
        prev.map((item) =>
          item.product._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(productId);
      setItems((prev) => prev.filter((item) => item.product._id !== productId));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price || item.product?.price?.amount || 0) * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Home</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        <span className="text-gray-700 dark:text-gray-200 font-medium">Shopping Cart</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Shopping Cart <span className="text-base text-gray-400 font-normal">({items.length} items)</span>
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center mb-5">
            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mt-2 mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex gap-4 p-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-2xl animate-fade-in">
                <Link to={`/product/${item.product._id}`} className="flex-shrink-0 w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#0f0f0f]">
                  <img
                    src={item.product.images?.[0]?.url || item.product.images?.[0] || 'https://via.placeholder.com/200'}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${item.product._id}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-[#FF6B35] transition-colors line-clamp-1">
                        {item.product.title}
                      </Link>
                      {/* <p className="text-xs text-gray-400 mt-0.5">Seller: {item.product.seller?.name || 'Unknown'}</p> */}
                    </div>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div className="inline-flex items-center bg-gray-50 dark:bg-[#0f0f0f] rounded-lg border border-gray-100 dark:border-[#2a2a2a]">
                      <button
                        onClick={() => updateQty(item.product._id, -1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product._id, 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.currency === 'INR' ? '₹' : item.currency + ' '}
                        {((item.price || item.product?.price?.amount || 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500 font-medium' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>

                {/* Promo */}
                <div className="pt-3 border-t border-gray-100 dark:border-[#2a2a2a]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#2a2a2a] rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-gray-300 dark:focus:border-gray-600"
                    />
                    <button className="px-4 py-2.5 text-xs font-semibold text-[#FF6B35] border border-[#FF6B35] rounded-xl hover:bg-[#FF6B35]/5 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-[#2a2a2a] text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 py-4 bg-[#FF6B35] text-white text-sm font-semibold rounded-xl hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <Link
                to="/"
                className="block w-full mt-3 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust */}
              <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-gray-100 dark:border-[#2a2a2a]">
                {['🔒 Secure', '🚚 Free Ship', '↩️ Returns'].map((t) => (
                  <span key={t} className="text-[10px] text-gray-400 font-medium">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
