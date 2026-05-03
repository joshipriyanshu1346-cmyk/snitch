import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCart } from '../../cart/services/cart.api';

const UserNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    fetchCart();
    window.addEventListener('cartUpdated', fetchCart);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', fetchCart);
    };
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

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartCount(data.cart?.items?.length || 0);
    } catch (err) {
      setCartCount(0);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/#featured-products' },
    { label: 'Favorites', path: '/favorites' },
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
              <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <span className="text-base font-bold text-white dark:text-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-black dark:text-white hidden sm:block" style={{ fontFamily: 'Poppins, sans-serif' }}>
                SNITCH
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-[13px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full" />
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
                to="/cart"
                className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 p-1.5 pr-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-black dark:hover:border-white transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-sm">
                  {user?.fullname?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 hidden sm:block">Account</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16 lg:h-18" />
    </>
  );
};

export default UserNavbar;
