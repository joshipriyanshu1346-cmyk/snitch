import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails } from '../services/order.api';
import OrderReceipt from '../components/OrderReceipt';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetails(id);
        if (res.success) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error("Error fetching order details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;

  return (
    <>
      {/* Hidden Receipt for Printing */}
      <div className="hidden print:block bg-white min-h-screen">
        <OrderReceipt order={order} />
      </div>

      {/* Visible UI */}
      <div className="max-w-4xl mx-auto px-4 py-12 print:hidden">
          {/* Success Header */}
          <div className="text-center mb-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
              <p className="text-gray-500 dark:text-gray-400">Thank you for shopping with SNITCH. Your order has been placed successfully.</p>
          </div>

          {/* Order Info Card */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-3xl p-8 mb-8 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                      <p className="font-semibold text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payment</p>
                      <p className="font-semibold text-gray-900 dark:text-white">Razorpay</p>
                  </div>
                  <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                      <p className="font-semibold text-[#FF6B35]">{order.status}</p>
                  </div>
              </div>
          </div>

          {/* Details Sections */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 dark:bg-[#0f0f0f] rounded-3xl p-8 border border-gray-100 dark:border-[#2a2a2a]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Shipping Address</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}<br />
                      Phone: {order.shippingAddress.phone}
                  </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#0f0f0f] rounded-3xl p-8 border border-gray-100 dark:border-[#2a2a2a]">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Order Summary</h3>
                  <div className="space-y-3">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Subtotal</span>
                          <span>₹{(order.totalAmount - (order.totalAmount > 1000 ? 0 : 99)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Shipping</span>
                          <span>{order.totalAmount > 1000 ? 'Free' : '₹99'}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-200 dark:border-[#2a2a2a] text-gray-900 dark:text-white">
                          <span>Total</span>
                          <span>₹{order.totalAmount.toLocaleString()}</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Itemized Receipt */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-3xl overflow-hidden mb-12">
              <div className="px-8 py-6 border-b border-gray-100 dark:border-[#2a2a2a]">
                  <h3 className="font-bold text-gray-900 dark:text-white">Itemized Receipt</h3>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-[#2a2a2a]">
                  {order.items.map((item, idx) => (
                      <div key={idx} className="px-8 py-6 flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-[#0f0f0f] rounded-xl overflow-hidden flex-shrink-0">
                              <img 
                                  src={item.product?.images?.[0]?.url || item.product?.images?.[0] || 'https://via.placeholder.com/100'} 
                                  alt="" 
                                  className="w-full h-full object-cover"
                              />
                          </div>
                          <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white">{item.product?.title || 'Product'}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                              <p className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-center">
                  Continue Shopping
              </Link>
              <button 
                onClick={handleDownload}
                className="px-10 py-4 border border-gray-200 dark:border-[#2a2a2a] rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-2 text-gray-900 dark:text-white"
              >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Invoice
              </button>
          </div>
      </div>
    </>
  );
};

export default OrderSuccess;
