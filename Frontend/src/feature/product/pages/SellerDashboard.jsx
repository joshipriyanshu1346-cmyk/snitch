import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from '../../auth/componets/EditProfileModal';

export const SellerDashboard = () => {
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
            Seller Hub
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your storefront and track your business growth</p>
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
              <div className="w-24 h-24 rounded-3xl bg-[#FF6B35] flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl shadow-[#FF6B35]/20" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {user.fullname?.charAt(0) || 'S'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullname}</h3>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#FF6B35]/10 text-[#FF6B35]">
                  Seller Account
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { label: 'Business Email', value: user.email, icon: '✉️' },
                { label: 'Contact', value: user.contact || 'Not provided', icon: '📱' },
                { label: 'Store Status', value: 'Active', icon: '✅' },
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
              Edit Store Profile
            </button>
          </div>
        </div>

        {/* Seller Stats and Actions */}
        <div className="lg:col-span-2 space-y-8">
           {/* Key Performance Indicators */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Products', value: '24', color: 'bg-[#FF6B35]' },
              { label: 'Total Sales', value: '₹45k', color: 'bg-green-500' },
              { label: 'Avg Rating', value: '4.8', color: 'bg-yellow-400' },
              { label: 'Active Orders', value: '8', color: 'bg-blue-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-[#1a1a1a] p-6 rounded-3xl border border-gray-100 dark:border-[#2a2a2a] shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className={`h-1 w-8 rounded-full mt-3 ${stat.color}`}></div>
              </div>
            ))}
          </div>

          {/* Seller Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Add New Product', desc: 'List a new item in your store', icon: '➕', path: '/create-product', color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600' },
              { label: 'Manage Inventory', desc: 'Edit or delete existing products', icon: '📦', path: '/seller-product-details', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600' },
              { label: 'Order Analytics', desc: 'Track your sales and revenue', icon: '📊', path: '#', color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600' },
              { label: 'Customer Reviews', desc: 'Read what buyers say about you', icon: '⭐', path: '#', color: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="group flex items-center gap-4 p-6 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] hover:border-[#FF6B35] transition-all shadow-sm"
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

          {/* Recent Sales / Activity */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-[#2a2a2a] p-8">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Store Insights</h3>
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Live</span>
                </div>
             </div>
             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">📈</div>
                      <div>
                         <p className="text-sm font-bold text-gray-900 dark:text-white">Profile views increased by 15%</p>
                         <p className="text-xs text-gray-500">Since last week</p>
                      </div>
                   </div>
                   <span className="text-xs text-blue-600 font-bold">+15%</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">🔔</div>
                      <div>
                         <p className="text-sm font-bold text-gray-900 dark:text-white">New order received #4920</p>
                         <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                   </div>
                   <span className="text-xs text-orange-600 font-bold">New</span>
                </div>
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

export default SellerDashboard;
