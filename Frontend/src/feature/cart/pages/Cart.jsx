import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CART_ITEMS = [
  { id: 1, name: 'Classic Leather Jacket', size: 'L', color: 'Black', price: 5999, originalPrice: 7999, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&q=80', qty: 1 },
  { id: 4, name: 'Minimal White Sneakers', size: '42', color: 'White', price: 3499, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&q=80', qty: 2 },
  { id: 7, name: 'Zip-Up Hoodie', size: 'M', color: 'Grey', price: 2799, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&q=80', qty: 1 },
];

const Cart = () => {
  const [items, setItems] = useState(CART_ITEMS);
  const [promoCode, setPromoCode] = useState('');

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

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
          <Link to="/products" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-2xl animate-fade-in">
                <Link to={`/product/${item.id}`} className="flex-shrink-0 w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#0f0f0f]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${item.id}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-[#FF6B35] transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">Size: {item.size} • Color: {item.color}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
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
                      <button onClick={() => updateQty(item.id, -1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors text-sm">−</button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors text-sm">+</button>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">₹{(item.price * item.qty).toLocaleString()}</span>
                      {item.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">₹{(item.originalPrice * item.qty).toLocaleString()}</p>
                      )}
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

              <button className="w-full mt-6 py-4 bg-[#FF6B35] text-white text-sm font-semibold rounded-xl hover:bg-[#e55a2b] transition-colors">
                Proceed to Checkout
              </button>
              <Link
                to="/products"
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
