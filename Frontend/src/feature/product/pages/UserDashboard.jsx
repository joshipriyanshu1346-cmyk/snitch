import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from '../../auth/componets/EditProfileModal';

export const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Hello, {user.fullname}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your orders and manage your account</p>
        </div>
        <div className="flex gap-3">
             <button
          onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}
          className="px-5 py-2.5 border-2 border-gray-200 dark:border-[#2a2a2a] rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          Sign Out
        </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] rounded-3xl p-8 shadow-sm h-full">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-3xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-3xl font-bold mb-4 shadow-xl shadow-black/10 dark:shadow-white/5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {user.fullname?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullname}</h3>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Customer Account
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { label: 'Email', value: user.email, icon: '✉️' },
                { label: 'Contact', value: user.contact || 'Not provided', icon: '📱' },
                { label: 'Joined', value: 'April 2026', icon: '📅' },
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5">
                  <span className="text-lg">{info.icon}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{info.label}</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Orders', value: '12', color: 'bg-blue-500' },
              { label: 'Wishlist', value: '24', color: 'bg-pink-500' },
              { label: 'Reviews', value: '5', color: 'bg-yellow-500' },
              { label: 'Rewards', value: '150', color: 'bg-green-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-[#1a1a1a] p-6 rounded-3xl border border-gray-100 dark:border-[#2a2a2a] shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className={`h-1 w-8 rounded-full mt-3 ${stat.color}`}></div>
              </div>
            ))}
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Browse Shop', desc: 'Discover the latest fashion trends', icon: '🛍️', path: '/#featured-products', color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' },
              { label: 'Track Order', desc: 'Check the status of your deliveries', icon: '🚚', path: '#', color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600' },
              { label: 'My Favorites', desc: 'Items you have saved for later', icon: '❤️', path: '/favorites', color: 'bg-red-50 dark:bg-red-500/10 text-red-600' },
              { label: 'Help Center', desc: 'Get support for your account', icon: '🎧', path: '#', color: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="group flex items-center gap-4 p-6 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] hover:border-black dark:hover:border-white transition-all shadow-sm"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${action.color}`}>
                  {action.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">{action.label}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Orders Placeholder */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-[#2a2a2a] p-8">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
                <Link to="#" className="text-sm font-semibold text-black dark:text-white hover:underline">View All</Link>
             </div>
             <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-[#0f0f0f] rounded-full flex items-center justify-center mb-4">
                   <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
                <Link to="/#featured-products" className="mt-4 text-sm font-bold text-black dark:text-white px-6 py-2 border-2 border-black dark:border-white rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">Start Shopping</Link>
             </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;
