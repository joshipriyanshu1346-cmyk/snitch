
import { useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProduct as updateProductAPI, deleteProduct as deleteProductAPI } from '../services/product.api';

const SellerproductDetails = () => {
    const { handleFetchProducts } = useProduct();
    let sellerproducts = useSelector((state) => state.product.sellerProducts);
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    
    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR'
    });
    
    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState(null);
    
    // Loading & Error States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        handleFetchProducts();
    }, []);

    // Ensure sellerproducts is an array (handles cases where API returns an object with products/data keys)
    if (!Array.isArray(sellerproducts)) {
        sellerproducts = sellerproducts?.products || sellerproducts?.data || [];
    }

    // Handle Edit Modal Open
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditFormData({
            title: product.title,
            description: product.description,
            priceAmount: product.price?.amount || '',
            priceCurrency: product.price?.currency || 'INR'
        });
        setEditModalOpen(true);
        setError('');
        setSuccess('');
    };

    // Handle Edit Form Change
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle Update Product
    const handleUpdateProduct = async () => {
        if (!editFormData.title.trim() || !editFormData.description.trim() || !editFormData.priceAmount) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', editFormData.title);
            formData.append('description', editFormData.description);
            formData.append('priceAmount', editFormData.priceAmount);
            formData.append('priceCurrency', editFormData.priceCurrency);

            const response = await updateProductAPI(editingProduct._id, formData);
            
            if (response.success) {
                setSuccess('Product updated successfully!');
                setEditModalOpen(false);
                setEditingProduct(null);
                setTimeout(() => {
                    setSuccess('');
                    handleFetchProducts();
                }, 1500);
            } else {
                setError(response.message || 'Failed to update product');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating product');
        } finally {
            setLoading(false);
        }
    };

    // Handle Delete Modal Open
    const handleDeleteClick = (productId) => {
        setDeletingProductId(productId);
        setDeleteModalOpen(true);
        setError('');
    };

    // Handle Delete Product
    const handleDeleteProduct = async () => {
        setLoading(true);
        try {
            const response = await deleteProductAPI(deletingProductId);
            
            if (response.success) {
                setSuccess('Product deleted successfully!');
                setDeleteModalOpen(false);
                setDeletingProductId(null);
                setTimeout(() => {
                    setSuccess('');
                    handleFetchProducts();
                }, 1500);
            } else {
                setError(response.message || 'Failed to delete product');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting product');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = sellerproducts.filter(product =>
        (product.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f9f9f9] dark:bg-neutral-950 text-[#1b1b1b] dark:text-white font-[Poppins]">
            {/* Success/Error Notifications */}
            {success && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[100] animate-in slide-in-from-top">
                    {success}
                </div>
            )}
            {error && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[100] animate-in slide-in-from-top">
                    {error}
                </div>
            )}



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
                                        <Link 
                                            to={`/product/${product._id}`}
                                            className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg" 
                                            title="View Details"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </Link>
                                        <button 
                                            onClick={() => handleEditClick(product)}
                                            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg" 
                                            title="Edit Product"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(product._id)}
                                            className="w-12 h-12 rounded-full bg-white text-red-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg" 
                                            title="Delete Product"
                                        >
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
                                        <Link to={`/product/${product._id}`}>
                                            <h3 className="text-lg font-bold tracking-tight group-hover:text-[#0041c8] transition-colors">{product.title}</h3>
                                        </Link>
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

            {/* Edit Product Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full animate-in scale-in-95 fade-in duration-300">
                        <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Edit Product</h2>
                            <button 
                                onClick={() => setEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditFormChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-[#0041c8] focus:border-transparent dark:bg-neutral-800 outline-none transition"
                                    placeholder="Product title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditFormChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-[#0041c8] focus:border-transparent dark:bg-neutral-800 outline-none transition resize-none"
                                    placeholder="Product description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Price</label>
                                    <input
                                        type="number"
                                        name="priceAmount"
                                        value={editFormData.priceAmount}
                                        onChange={handleEditFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-[#0041c8] focus:border-transparent dark:bg-neutral-800 outline-none transition"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Currency</label>
                                    <select
                                        name="priceCurrency"
                                        value={editFormData.priceCurrency}
                                        onChange={handleEditFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-[#0041c8] focus:border-transparent dark:bg-neutral-800 outline-none transition"
                                    >
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-neutral-800 flex gap-3">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProduct}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-[#0041c8] text-white rounded-lg hover:bg-[#0035a0] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Product Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-sm w-full animate-in scale-in-95 fade-in duration-300">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4v2m0 0v2m0-4H9m3 0h3M9 3h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-center mb-2">Delete Product?</h2>
                            <p className="text-gray-500 text-center text-sm mb-6">
                                Are you sure you want to delete this product? This action cannot be undone.
                            </p>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-neutral-800 flex gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProduct}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerproductDetails;
