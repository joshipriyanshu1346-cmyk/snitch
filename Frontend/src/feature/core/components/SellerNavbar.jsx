import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SellerNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navLinks = [
    { label: 'Overview', path: '/dashboard', icon: '📊' },
    { label: 'My Products', path: '/seller-product-details', icon: '📦' },
    { label: 'Add Product', path: '/create-product', icon: '➕' },
    { label: 'Orders', path: '/seller/orders', icon: '🛒' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-white/5'
            : 'bg-white dark:bg-[#0f0f0f] border-b border-gray-100 dark:border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B35] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-[#FF6B35]/20">
                <span className="text-base font-bold text-white tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-black dark:text-white hidden sm:block" style={{ fontFamily: 'Poppins, sans-serif' }}>
                SNITCH <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-[0.2em] ml-1">Seller</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#FF6B35] transition-colors relative group"
                >
                  <span>{link.icon}</span>
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#FF6B35] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 p-1.5 pr-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-[#FF6B35] transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white font-bold text-sm">
                  {user?.fullname?.charAt(0) || 'S'}
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 hidden sm:block">{user?.fullname?.split(' ')[0]}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16 lg:h-18" />
    </>
  );
};

export default SellerNavbar;
