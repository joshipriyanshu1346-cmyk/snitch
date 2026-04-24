import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      handleRegister({
        email: formData.email,
        password: formData.password,
        contact: formData.contactNumber,
        fullname: formData.fullName,
        isSeller: formData.isSeller,
      });
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  const inputBox = (field) =>
    `flex items-center rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-neutral-900 ${
      focused === field ? 'border-black dark:border-white' : 'border-gray-200 dark:border-neutral-800'
    }`;

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-neutral-950">
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&h=1600&fit=crop&q=80"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
              <span className="text-base font-bold text-black font-[Poppins]">S</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight font-[Poppins]">SNITCH</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight font-[Poppins]">
            Join 50,000+<br />fashion enthusiasts.
          </h2>
          <p className="text-sm text-white/60 mt-3 max-w-sm">
            Create your account and start discovering the best in men's fashion.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md py-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:mb-10">
            <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center">
              <span className="text-base font-bold text-white dark:text-black font-[Poppins]">S</span>
            </div>
            <span className="text-lg font-bold text-black dark:text-white tracking-tight font-[Poppins]">SNITCH</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white font-[Poppins]">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mt-2 mb-6">Join Snitch and start your fashion journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className={inputBox('fullName')}>
                <div className="pl-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} onFocus={() => setFocused('fullName')} onBlur={() => setFocused('')} placeholder="John Doe" required className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-3 px-3 outline-none" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className={inputBox('email')}>
                <div className="pl-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} placeholder="john@example.com" required className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-3 px-3 outline-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className={inputBox('password')}>
                <div className="pl-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onFocus={() => setFocused('password')} onBlur={() => setFocused('')} placeholder="Min. 8 characters" required className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-3 px-3 outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${formData.password.length > i * 3 ? (formData.password.length < 6 ? 'bg-red-400' : formData.password.length < 10 ? 'bg-yellow-400' : 'bg-green-500') : 'bg-gray-200 dark:bg-neutral-700'}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Number</label>
              <div className={inputBox('contactNumber')}>
                <div className="pl-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input id="contactNumber" type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} onFocus={() => setFocused('contactNumber')} onBlur={() => setFocused('')} placeholder="+91 98765 43210" required className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-3 px-3 outline-none" />
              </div>
            </div>

            {/* Seller Checkbox */}
            <div className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${formData.isSeller ? 'bg-orange-50 dark:bg-orange-500/5 border-orange-300 dark:border-orange-500/30' : 'bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-600'}`}>
              <label className="flex items-center gap-3 cursor-pointer w-full">
                <input id="isSeller" type="checkbox" name="isSeller" checked={formData.isSeller} onChange={handleChange} className="h-4 w-4 rounded accent-orange-500 cursor-pointer" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Register as a Seller</span>
                    {formData.isSeller && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg uppercase">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">List your products and start selling today.</p>
                </div>
              </label>
            </div>

            <button id="register-submit" type="submit" className="w-full py-4 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-orange-500 hover:underline underline-offset-2 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
