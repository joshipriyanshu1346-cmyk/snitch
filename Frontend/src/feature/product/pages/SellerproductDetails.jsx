
import { useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SellerproductDetails = () => {
    const { handleFetchProducts } = useProduct();
    let sellerproducts = useSelector((state) => state.product.sellerProducts);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        handleFetchProducts();
    }, []);

    // Ensure sellerproducts is an array (handles cases where API returns an object with products/data keys)
    if (!Array.isArray(sellerproducts)) {
        sellerproducts = sellerproducts?.products || sellerproducts?.data || [];
    }

    const filteredProducts = sellerproducts.filter(product =>
        (product.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f9f9f9] dark:bg-neutral-950 text-[#1b1b1b] dark:text-white font-[Poppins]">
            {/* Header / Navigation */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                                <span className="text-base font-bold text-white dark:text-black">S</span>
                            </div>
                            <span className="text-lg font-bold tracking-tight">SNITCH</span>
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 text-sm ml-6">
                            <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                Dashboard
                            </Link>
                            <svg className="w-4 h-4 text-gray-300 dark:text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium">My Products</span>
                        </div>
                    </div>

                    <Link to="/create-product" className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
                {/* Page Hero Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 rounded-full bg-[#0041c8]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0041c8]">Inventory Control</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">My Products</h1>
                        <p className="text-gray-500 max-w-md text-sm leading-relaxed">
                            Manage your collection with surgical precision. Edit details, update pricing, or refine your presentation.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0041c8] transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#0041c8]/20 transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] outline-none"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="group flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] mb-6 overflow-hidden rounded-[2rem] bg-[#f3f3f3] dark:bg-neutral-900">
                                    <img
                                        src={product.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image'}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />

                                    {/* Action Overlays */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                        <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Edit Product">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button className="w-12 h-12 rounded-full bg-white text-red-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Delete Product">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Price Tag */}
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold shadow-sm">
                                        {product.price?.currency === 'INR' ? '₹' : product.price?.currency} {product.price?.amount?.toLocaleString()}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold tracking-tight group-hover:text-[#0041c8] transition-colors">{product.title}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">
                                        {product.description || 'No description provided.'}
                                    </p>

                                    <div className="flex items-center gap-4 mt-auto pt-2">
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            Added {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-neutral-900 rounded-[3rem] text-center shadow-sm">
                        <div className="w-20 h-20 rounded-full bg-[#f3f3f3] dark:bg-neutral-800 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No products found</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">
                            {searchQuery ? `No products match your search "${searchQuery}".` : "You haven't listed any products yet. Start by adding your first masterpiece."}
                        </p>
                        <Link to="/create-product" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform">
                            Create First Product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerproductDetails;
