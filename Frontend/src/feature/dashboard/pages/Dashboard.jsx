import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const isSeller = user.role === 'seller';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#16213e] relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Snitch Store</h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Welcome Card */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome, {user.fullname}!</h2>
            <p className="text-white/60">Manage your account and start your journey with Snitch Store</p>
          </div>

          {/* Role Display Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Profile Card */}
            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Profile Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-white">{user.fullname}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-lg font-semibold text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Contact</p>
                  <p className="text-lg font-semibold text-white">{user.contact || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Role Card */}
            <div
              className={`backdrop-blur-2xl border rounded-2xl p-8 hover:border-white/20 transition-all ${
                isSeller
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                    isSeller
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                  }`}
                >
                  {isSeller ? (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Account Type</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/50 uppercase tracking-wider mb-2">Your Role</p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wider ${
                        isSeller
                          ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                          : 'bg-blue-500/30 text-blue-200 border border-blue-500/50'
                      }`}
                    >
                      {user.role === 'seller' ? '🚀 Seller' : '🛍️ Buyer'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-white/50 uppercase tracking-wider mb-2">Status</p>
                  <p
                    className={`text-sm ${
                      isSeller ? 'text-emerald-200' : 'text-blue-200'
                    }`}
                  >
                    {isSeller
                      ? '✓ You can list and sell products'
                      : '✓ You can browse and purchase products'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {isSeller && (
              <button className="bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl transition-all transform hover:scale-105">
                📦 Add Product
              </button>
            )}
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-2xl transition-all border border-white/20">
              {isSeller ? '📊 View Sales' : '📜 My Orders'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
