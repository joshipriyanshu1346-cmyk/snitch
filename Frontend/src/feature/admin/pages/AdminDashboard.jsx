import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const STATS = [
  { label: 'Total Revenue', value: '₹4,82,350', change: '+12.5%', up: true, icon: '💰' },
  { label: 'Total Orders', value: '1,247', change: '+8.2%', up: true, icon: '📦' },
  { label: 'Total Products', value: '186', change: '+3', up: true, icon: '🏷️' },
  { label: 'Active Users', value: '3,892', change: '-2.4%', up: false, icon: '👥' },
];

const RECENT_ORDERS = [
  { id: 'ORD-3012', customer: 'Rahul Sharma', amount: 5999, status: 'Delivered', date: 'Today' },
  { id: 'ORD-3011', customer: 'Amit Patel', amount: 3499, status: 'Shipped', date: 'Today' },
  { id: 'ORD-3010', customer: 'Rohit Kumar', amount: 8498, status: 'Processing', date: 'Yesterday' },
  { id: 'ORD-3009', customer: 'Vikash Singh', amount: 2799, status: 'Delivered', date: 'Yesterday' },
  { id: 'ORD-3008', customer: 'Priya Gupta', amount: 12498, status: 'Shipped', date: 'Apr 19' },
];

const TOP_PRODUCTS = [
  { name: 'Classic Leather Jacket', sold: 89, revenue: '₹5,33,911', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop&q=80' },
  { name: 'Minimal White Sneakers', sold: 76, revenue: '₹2,65,924', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop&q=80' },
  { name: 'Oversized Cotton Tee', sold: 152, revenue: '₹1,97,448', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop&q=80' },
  { name: 'Chronograph Watch', sold: 34, revenue: '₹1,69,966', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop&q=80' },
];

const STATUS_STYLES = {
  Delivered: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  Shipped: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Processing: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
};

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>, active: true },
  { label: 'Products', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { label: 'Orders', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
  { label: 'Customers', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  { label: 'Analytics', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { label: 'Settings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-[#1a1a1a] transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-[#1a1a1a]">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                <span className="text-sm font-bold text-white dark:text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>S</span>
              </div>
              <span className="text-base font-bold text-black dark:text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>SNITCH</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#FF6B35]/10 text-[#FF6B35] rounded uppercase">Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-100 dark:border-[#1a1a1a]">
            <button
              onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-gray-200 dark:border-[#1a1a1a] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a1a] px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2a2a2a]">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search..." className="bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none w-40" />
            </div>
            <button className="relative p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B35] rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-sm font-bold">A</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`p-5 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-2xl animate-fade-in-up opacity-0 stagger-${i + 1}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${stat.up ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Recent Orders Table */}
            <div className="lg:col-span-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-[#2a2a2a]">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Orders</h3>
                <button className="text-xs font-medium text-[#FF6B35] hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-[#2a2a2a]">
                      <th className="text-left px-6 py-3">Order</th>
                      <th className="text-left px-6 py-3 hidden sm:table-cell">Customer</th>
                      <th className="text-left px-6 py-3">Amount</th>
                      <th className="text-left px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ORDERS.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 dark:border-[#1a1a1a] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</p>
                          <p className="text-xs text-gray-400">{order.date}</p>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-600 dark:text-gray-400">{order.customer}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">₹{order.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${STATUS_STYLES[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-[#2a2a2a]">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Top Products</h3>
              </div>
              <div className="p-4 space-y-3">
                {TOP_PRODUCTS.map((product, i) => (
                  <div key={product.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                    <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-5">#{i + 1}</span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.sold} sold</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">{product.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
