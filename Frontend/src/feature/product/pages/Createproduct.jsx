import React, { useState, useRef, useEffect } from 'react';
import { useProduct } from '../hook/useProduct.js';
import { useNavigate, Link } from 'react-router-dom';

const Createproduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
    images: [], // Changed to array
  });

  const [files, setFiles] = useState([]); // Add files state

  const [focused, setFocused] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]); // Changed to array
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUrlAdd = () => {
    if (!urlInput) return;
    if (formData.images.length >= 7) {
      alert('You can only upload up to 7 images.');
      return;
    }
    setFormData((prev) => ({ ...prev, images: [...prev.images, urlInput] }));
    setImagePreviews((prev) => [...prev, urlInput]);
    setUrlInput('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const remainingSlots = 7 - formData.images.length;
    if (remainingSlots <= 0) {
      setNotification({
        show: true,
        message: 'You have already reached the limit of 7 images.',
        type: 'error'
      });
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setNotification({
        show: true,
        message: `Only the first ${remainingSlots} images were added. Limit is 7.`,
        type: 'error'
      });
    }

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
        setFormData((prev) => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });

    setFiles((prev) => [...prev, ...filesToProcess]); // Store the actual files
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.priceAmount) return;

    setIsSubmitting(true);

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("priceAmount", formData.priceAmount);
    data.append("priceCurrency", formData.priceCurrency);

    // Append all images
    files.forEach(file => data.append("images", file));

    try {
      await handleCreateProduct(data);
      setNotification({
        show: true,
        message: 'Product published successfully! Redirecting...',
        type: 'success'
      });

      // Delay navigation to let user see the success message
      setTimeout(() => {
        navigate('/seller-product-details');
      }, 1500);
    } catch (err) {
      console.log(err.response?.data);
      setNotification({
        show: true,
        message: err.response?.data?.message || 'Failed to publish product. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }



  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setFiles((prev) => prev.filter((_, i) => i !== index)); // Remove from files too
  };

  const inputBox = (field) =>
    `flex items-center rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-neutral-900 ${focused === field
      ? 'border-black dark:border-white'
      : 'border-gray-200 dark:border-neutral-800'
    }`;

  const currencies = [
    { value: 'INR', label: '₹ INR', symbol: '₹' },
    { value: 'USD', label: '$ USD', symbol: '$' },
    { value: 'EUR', label: '€ EUR', symbol: '€' },
    { value: 'GBP', label: '£ GBP', symbol: '£' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 relative">
      {/* Custom Notification */}
      {notification.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${notification.type === 'success'
            ? 'bg-white dark:bg-neutral-900 border-green-100 dark:border-green-900/30'
            : 'bg-white dark:bg-neutral-900 border-red-100 dark:border-red-900/30'
            }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-50 dark:bg-green-500/10' : 'bg-red-50 dark:bg-red-500/10'
              }`}>
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white font-[Poppins]">
                {notification.type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-4 p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="border-b border-gray-100 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center">
              <span className="text-base font-bold text-white dark:text-black font-[Poppins]">S</span>
            </div>
            <span className="text-lg font-bold text-black dark:text-white tracking-tight font-[Poppins]">SNITCH</span>
          </Link>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Dashboard
            </Link>
            <svg className="w-4 h-4 text-gray-300 dark:text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">New Product</span>
          </div>

          {/* Back */}
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Close</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest font-[Poppins]">Seller Portal</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-[Poppins] tracking-tight">
            Create New Product
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-lg">
            Add a new product to your store. Fill in the details below and publish when ready.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Column — Image Upload */}
            <div className="w-full lg:w-5/12">
              <div className="sticky top-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 font-[Poppins]">
                  Product Image
                </label>

                {/* Upload Zone */}
                <div
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${dragActive
                    ? 'border-orange-400 bg-orange-50/50 dark:bg-orange-500/5'
                    : imagePreviews.length > 0
                      ? 'border-transparent bg-gray-50 dark:bg-neutral-900'
                      : 'border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-neutral-700'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{ aspectRatio: '4/5' }}
                >
                  {imagePreviews.length > 0 ? (
                    <div className="h-full flex flex-col p-4">
                      {/* Main Preview (First Image) */}
                      <div className="flex-1 min-h-0 relative mb-4">
                        <img
                          src={imagePreviews[0]}
                          alt="Main preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(0)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:scale-105 transition-transform"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Small Previews Grid */}
                      <div className="grid grid-cols-4 gap-2 h-20">
                        {imagePreviews.slice(1).map((src, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={src}
                              alt={`Preview ${idx + 2}`}
                              className="w-full h-full object-cover rounded-lg border border-gray-100 dark:border-neutral-800"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx + 1)}
                              className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        {imagePreviews.length < 7 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-full flex items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center h-full cursor-pointer px-6"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {/* Upload Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-5">
                        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white font-[Poppins] mb-1">
                        Click to upload product images
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        or drag and drop here (Max 7)
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 font-medium">PNG</span>
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 font-medium">JPG</span>
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 font-medium">WEBP</span>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* OR divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-800" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or paste URL</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-800" />
                </div>

                {/* Image URL Input */}
                <div className="flex gap-2">
                  <div className={`flex-1 ${inputBox('urlInput')}`}>
                    <div className="pl-4 text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <input
                      id="urlInput"
                      type="url"
                      name="urlInput"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onFocus={() => setFocused('urlInput')}
                      onBlur={() => setFocused('')}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-3.5 px-3 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUrlAdd}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-50"
                    disabled={!urlInput || formData.images.length >= 7}
                  >
                    Add
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest">
                  {formData.images.length} of 7 slots used
                </p>
              </div>
            </div>

            {/* Right Column — Form Details */}
            <div className="w-full lg:w-7/12">
              <div className="space-y-5">
                {/* Product Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Product Title <span className="text-red-400">*</span>
                  </label>
                  <div className={inputBox('title')}>
                    <div className="pl-4 text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      onFocus={() => setFocused('title')}
                      onBlur={() => setFocused('')}
                      placeholder="e.g. Classic Fit Oxford Shirt"
                      required
                      className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-3.5 px-3 outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description
                  </label>
                  <div
                    className={`rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-neutral-900 ${focused === 'description'
                      ? 'border-black dark:border-white'
                      : 'border-gray-200 dark:border-neutral-800'
                      }`}
                  >
                    <div className="flex items-start pt-3">
                      <div className="pl-4 pt-0.5 text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </div>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onFocus={() => setFocused('description')}
                        onBlur={() => setFocused('')}
                        placeholder="Describe your product — fabric, fit, style, care instructions..."
                        rows={5}
                        className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-0 px-3 outline-none resize-none"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 ml-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {/* Price Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Price Amount */}
                  <div className="flex-1">
                    <label htmlFor="priceAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Price Amount <span className="text-red-400">*</span>
                    </label>
                    <div className={inputBox('priceAmount')}>
                      <div className="pl-4 text-gray-400">
                        <span className="text-base font-medium">
                          {currencies.find((c) => c.value === formData.priceCurrency)?.symbol || '₹'}
                        </span>
                      </div>
                      <input
                        id="priceAmount"
                        type="number"
                        name="priceAmount"
                        value={formData.priceAmount}
                        onChange={handleChange}
                        onFocus={() => setFocused('priceAmount')}
                        onBlur={() => setFocused('')}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-3.5 px-3 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Price Currency */}
                  <div className="sm:w-44">
                    <label htmlFor="priceCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Currency
                    </label>
                    <div className={inputBox('priceCurrency')}>
                      <div className="pl-4 text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <select
                        id="priceCurrency"
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        onFocus={() => setFocused('priceCurrency')}
                        onBlur={() => setFocused('')}
                        className="w-full bg-transparent text-gray-900 dark:text-white text-sm py-3.5 px-3 outline-none appearance-none cursor-pointer"
                      >
                        {currencies.map((c) => (
                          <option key={c.value} value={c.value} className="bg-white dark:bg-neutral-900">
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className="pr-4 text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Preview Pill */}
                {formData.priceAmount && (
                  <div className="flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                    <div className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                      <span className="text-xs text-gray-400 mr-2">Listed price:</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white font-[Poppins]">
                        {currencies.find((c) => c.value === formData.priceCurrency)?.symbol}
                        {Number(formData.priceAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs text-gray-400 ml-1.5">{formData.priceCurrency}</span>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-gray-100 dark:bg-neutral-900 my-2" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button

                    id="create-product-submit"
                    type="submit"
                    disabled={isSubmitting || !formData.title || !formData.priceAmount}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer font-[Poppins] ${isSubmitting || !formData.title || !formData.priceAmount
                      ? 'bg-gray-200 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600 cursor-not-allowed'
                      : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Publish Product
                      </>
                    )}
                  </button>

                  <Link
                    to="/dashboard"
                    className="sm:w-auto px-8 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-xl border-2 border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createproduct;