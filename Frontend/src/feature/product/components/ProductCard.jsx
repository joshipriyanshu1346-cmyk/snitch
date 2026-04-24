import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, index = 0 }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

  return (
    <div className={`group animate-fade-in-up opacity-0 ${staggerClass}`}>
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 dark:bg-[#1a1a1a]">
          {/* Skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 skeleton rounded-2xl" />
          )}

          <img
            src={Array.isArray(product.images) ? product.images[0] : product.image}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover product-img-zoom ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black rounded-lg">
                New
              </span>
            )}
            {product.discount && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#FF6B35] text-white rounded-lg">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              wishlisted
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/80 dark:bg-black/60 backdrop-blur-sm text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-black'
            }`}
            aria-label="Toggle wishlist"
          >
            <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Add to Cart Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.category}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({product.reviews})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
