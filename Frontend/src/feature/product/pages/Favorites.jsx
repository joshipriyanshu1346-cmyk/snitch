import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFavorites } from '../../auth/services/auth.api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { user } = useSelector((state) => state.auth);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getFavorites();
        if (response.success) {
          setFavorites(response.favorites || []);
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ❤️
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Your Wishlist
        </h2>
        <p className="text-gray-500 mb-8">Please login to view your favorite products</p>
        <Link to="/login" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl transition-all hover:bg-gray-800 dark:hover:bg-gray-100">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
          My Favorites
        </h1>
        <p className="text-gray-500 mt-2">Products you've saved for later</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl mb-4" />
              <div className="h-4 bg-gray-100 dark:bg-[#1a1a1a] rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 dark:bg-[#1a1a1a] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-[#0f0f0f] rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#2a2a2a]">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-8 text-sm">Start exploring and save your favorite fashion items!</p>
          <Link to="/" className="px-8 py-3 bg-[#FF6B35] text-white font-bold rounded-xl hover:bg-[#e55a2b] transition-all">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
