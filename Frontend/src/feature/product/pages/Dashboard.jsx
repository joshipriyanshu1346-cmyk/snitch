import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Createproduct from './Createproduct';
import { useProduct } from '../hook/useProduct.js';



const ORDERS = [
  { id: 'ORD-2841', date: 'Apr 18, 2026', status: 'Delivered', total: 5999, items: 1, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop&q=80' },
  { id: 'ORD-2763', date: 'Apr 12, 2026', status: 'Shipped', total: 6998, items: 2, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop&q=80' },
  { id: 'ORD-2654', date: 'Mar 28, 2026', status: 'Delivered', total: 2799, items: 1, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop&q=80' },
];

const STATUS_STYLES = {
  Delivered: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  Shipped: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Processing: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
};

export const Dashboard = () => {


  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const isSeller = user.role === 'seller';

  const stats = [
    { label: 'Total Orders', value: '12', icon: '📦', color: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Wishlist', value: '8', icon: '❤️', color: 'bg-red-50 dark:bg-red-500/10' },
    { label: 'Reviews', value: '5', icon: '⭐', color: 'bg-yellow-50 dark:bg-yellow-500/10' },
    { label: isSeller ? 'Products' : 'Rewards', value: isSeller ? '24' : '₹500', icon: isSeller ? '🏷️' : '🎁', color: 'bg-green-50 dark:bg-green-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome, {user.fullname}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and track orders</p>
        </div>
        <button
          onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}
          className="px-5 py-2.5 border-2 border-gray-200 dark:border-[#2a2a2a] rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] animate-fade-in-up opacity-0 stagger-${i + 1}`}>
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-lg mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {user.fullname?.charAt(0) || 'S'}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{user.fullname}</h3>
              <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg ${isSeller ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}>
                {isSeller ? 'Seller' : 'Buyer'}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Email', value: user.email },
              { label: 'Phone', value: user.contact || 'Not set' },
              { label: 'Member since', value: 'April 2026' },
            ].map((info) => (
              <div key={info.label}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{info.label}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{info.value}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-5 py-2.5 border-2 border-gray-200 dark:border-[#2a2a2a] rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Orders</h3>
            <button className="text-xs font-medium text-[#FF6B35] hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {ORDERS.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-[#2a2a2a] hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                  <img src={order.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.id}</p>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{order.date} • {order.items} item{order.items > 1 ? 's' : ''}</p>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white hidden sm:block">₹{order.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: isSeller ? 'Add Product' : 'Browse Shop', icon: isSeller ? '➕' : '🛍️', path:isSeller ? '/create-product' : '/products' },
          { label: isSeller ? 'View Sales' : 'Track Order', icon: isSeller ? '📊' : '🚚', path: '#' },
          { label: 'Wishlist', icon: '❤️', path: '/products' },
          { label: 'Settings', icon: '⚙️', path: '#' },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.path}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all"
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
