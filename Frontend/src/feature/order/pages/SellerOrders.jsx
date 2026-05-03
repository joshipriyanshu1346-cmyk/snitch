import React, { useEffect, useState } from 'react';
import { getSellerOrders, updateOrderStatus } from '../services/order.api';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await getSellerOrders();
            if (res.success) {
                setOrders(res.orders);
            }
        } catch (err) {
            console.error("Error fetching seller orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            console.error("Error updating status", err);
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading orders...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your product sales.</p>
                </div>
                <div className="bg-[#FF6B35]/10 text-[#FF6B35] px-4 py-2 rounded-xl text-sm font-semibold">
                    {orders.length} Total Orders
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-20 text-center border border-gray-100 dark:border-[#2a2a2a]">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-[#0f0f0f] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">No orders yet</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">When customers buy your products, they will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6 border-b border-gray-50 dark:border-[#2a2a2a] flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-[#0f0f0f] rounded-2xl flex items-center justify-center font-bold text-gray-400">
                                        #{order._id.slice(-4).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Order #{order._id}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        order.status === 'PAID' ? 'bg-green-100 text-green-600' :
                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' :
                                        order.status === 'DELIVERED' ? 'bg-purple-100 text-purple-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {order.status}
                                    </span>
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        className="bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-[#2a2a2a] rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-[#FF6B35] transition-colors"
                                    >
                                        <option value="PAID">Paid</option>
                                        <option value="PACKING">Packing</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Customer & Shipping</h4>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.shippingAddress.address}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.shippingAddress.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Items Summary</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-50 dark:bg-[#0f0f0f] rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={item.product?.images?.[0]?.url || item.product?.images?.[0] || 'https://via.placeholder.com/50'} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.product?.title}</p>
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-[#0f0f0f] flex justify-between items-center">
                                <span className="text-sm text-gray-500">Payment via Razorpay</span>
                                <div className="text-right">
                                    <span className="text-xs text-gray-400 mr-2">Order Total:</span>
                                    <span className="text-lg font-bold text-[#FF6B35]">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
