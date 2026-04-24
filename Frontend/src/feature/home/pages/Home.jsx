import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../product/components/ProductCard';

const HERO_SLIDES = [
  { id: 1, title: 'Summer Collection', subtitle: '2026', tagline: 'Effortless style for every occasion', cta: 'Shop Now', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&h=800&fit=crop&q=80' },
  { id: 2, title: 'New Arrivals', subtitle: 'Just Dropped', tagline: 'Fresh styles that define the season', cta: 'Explore', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1400&h=800&fit=crop&q=80' },
  { id: 3, title: 'Flash Sale', subtitle: 'Up to 50% Off', tagline: 'Limited time only — don\'t miss out', cta: 'Shop Sale', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=800&fit=crop&q=80' },
];

const CATEGORIES = [
  { name: 'T-Shirts', icon: '👕', count: 240 },
  { name: 'Jeans', icon: '👖', count: 180 },
  { name: 'Jackets', icon: '🧥', count: 95 },
  { name: 'Sneakers', icon: '👟', count: 150 },
  { name: 'Watches', icon: '⌚', count: 60 },
  { name: 'Accessories', icon: '🎒', count: 320 },
];

const PRODUCTS = [
  { id: 1, name: 'Oversized Cotton Tee', category: 'T-Shirts', price: 1299, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=80', rating: 4.5, reviews: 128, isNew: true },
  { id: 2, name: 'Slim Fit Dark Wash Jeans', category: 'Jeans', price: 2499, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop&q=80', rating: 4.3, reviews: 89 },
  { id: 3, name: 'Classic Leather Jacket', category: 'Jackets', price: 5999, originalPrice: 7999, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=80', rating: 4.8, reviews: 256, discount: 25 },
  { id: 4, name: 'Minimal White Sneakers', category: 'Sneakers', price: 3499, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop&q=80', rating: 4.6, reviews: 194, isNew: true },
  { id: 5, name: 'Printed Camp Shirt', category: 'Shirts', price: 1799, originalPrice: 2499, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=80', rating: 4.2, reviews: 67, discount: 28 },
  { id: 6, name: 'Cargo Jogger Pants', category: 'Pants', price: 2199, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=80', rating: 4.4, reviews: 142 },
  { id: 7, name: 'Zip-Up Hoodie', category: 'Hoodies', price: 2799, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop&q=80', rating: 4.7, reviews: 203, isNew: true },
  { id: 8, name: 'Chronograph Watch', category: 'Watches', price: 4999, originalPrice: 6999, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=800&fit=crop&q=80', rating: 4.9, reviews: 312, discount: 30 },
];

const FLASH_PRODUCTS = PRODUCTS.filter(p => p.discount).slice(0, 4);

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 23, s: 47 });

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div>
      {/* ═══ HERO BANNER SLIDER ═══ */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden bg-black">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              i === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div key={currentSlide} className="max-w-xl animate-fade-in-up">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-3">
                {HERO_SLIDES[currentSlide].subtitle}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {HERO_SLIDES[currentSlide].title}
              </h1>
              <p className="text-base sm:text-lg text-white/70 mt-4 max-w-md">
                {HERO_SLIDES[currentSlide].tagline}
              </p>
              <div className="flex gap-3 mt-8">
                <Link to="/products" className="px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                  {HERO_SLIDES[currentSlide].cta}
                </Link>
                <Link to="/products" className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors">
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ═══ CATEGORY ICONS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              to="/products"
              className={`group flex flex-col items-center gap-2.5 p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] hover:border-[#FF6B35]/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 animate-fade-in-up opacity-0 stagger-${i + 1}`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{cat.name}</span>
              <span className="text-[10px] text-gray-400">{cat.count} items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ FLASH SALE ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
        <div className="bg-black dark:bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-800 dark:border-[#2a2a2a]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B35]">Flash Sale</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Deal of the Day
              </h2>
            </div>
            <div className="flex gap-2">
              {[
                { val: pad(timeLeft.h), label: 'Hrs' },
                { val: pad(timeLeft.m), label: 'Min' },
                { val: pad(timeLeft.s), label: 'Sec' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-white font-mono">{t.val}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 uppercase">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {FLASH_PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Curated For You</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Featured Products
            </h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-[#FF6B35] hover:underline underline-offset-4 transition-all">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* ═══ SPLIT BANNER ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20">
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          {[
            { title: 'Streetwear Edit', sub: 'Bold. Urban. Unapologetic.', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=700&h=500&fit=crop&q=80' },
            { title: 'Formal Essentials', sub: 'Refined looks for every occasion.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&h=500&fit=crop&q=80' },
          ].map((banner) => (
            <Link
              key={banner.title}
              to="/products"
              className="group relative h-64 sm:h-72 lg:h-80 rounded-3xl overflow-hidden"
            >
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8">
                <h3 className="text-xl lg:text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{banner.title}</h3>
                <p className="text-sm text-white/70 mt-1">{banner.sub}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white mt-3 uppercase tracking-wider group-hover:gap-2 transition-all">
                  Shop Now
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
