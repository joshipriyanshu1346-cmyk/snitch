import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router-dom';
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
    try{
      handleRegister({
        email:formData.email,
        password:formData.password,
        contact:formData.contactNumber,
        fullname:formData.fullName,
        isSeller:formData.isSeller
      });
      navigate("/dashboard")
    }
    catch(err){
      console.log(err)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0f]">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Brand badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-medium text-white/60 tracking-widest uppercase">
              Snitch Store
            </span>
          </div>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-violet-950/40">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30 mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
            <p className="text-sm text-white/40 mt-1.5">Join thousands of shoppers on Snitch</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="group">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Full Name
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focused === 'fullName' ? 'border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.15)]' : 'border-white/10'} bg-white/[0.05]`}>
                <span className="pl-4 text-white/30">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={() => setFocused('fullName')}
                  onBlur={() => setFocused('')}
                  placeholder="John Doe"
                  required
                  className="w-full bg-transparent text-white placeholder-white/20 text-sm py-3.5 px-3 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Email Address
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focused === 'email' ? 'border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.15)]' : 'border-white/10'} bg-white/[0.05]`}>
                <span className="pl-4 text-white/30">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="john@example.com"
                  required
                  className="w-full bg-transparent text-white placeholder-white/20 text-sm py-3.5 px-3 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Password
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focused === 'password' ? 'border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.15)]' : 'border-white/10'} bg-white/[0.05]`}>
                <span className="pl-4 text-white/30">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full bg-transparent text-white placeholder-white/20 text-sm py-3.5 px-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password strength bar */}
              {formData.password && (
                <div className="mt-2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${formData.password.length > i * 3
                        ? formData.password.length < 6
                          ? 'bg-red-500'
                          : formData.password.length < 10
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        : 'bg-white/10'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Contact Number */}
            <div className="group">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                Contact Number
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${focused === 'contactNumber' ? 'border-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.15)]' : 'border-white/10'} bg-white/[0.05]`}>
                <span className="pl-4 text-white/30">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  id="contactNumber"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onFocus={() => setFocused('contactNumber')}
                  onBlur={() => setFocused('')}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full bg-transparent text-white placeholder-white/20 text-sm py-3.5 px-3 outline-none"
                />
              </div>
            </div>

            {/* Seller Checkbox */}
            <div className="group">
              <label
                htmlFor="isSeller"
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${formData.isSeller
                  ? 'border-violet-500/60 bg-violet-500/10 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20'
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <input
                    id="isSeller"
                    type="checkbox"
                    name="isSeller"
                    checked={formData.isSeller}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${formData.isSeller ? 'bg-violet-500 border-violet-500' : 'border-white/30 bg-white/5'}`}>
                    {formData.isSeller && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Register as a Seller</span>
                    {formData.isSeller && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-500/30 text-violet-300 rounded-full border border-violet-500/30 uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/35 mt-0.5">List your products and start selling today</p>
                </div>
                <div className={`transition-all duration-300 ${formData.isSeller ? 'opacity-100' : 'opacity-30'}`}>
                  <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="register-submit"
                type="submit"
                className="relative w-full group overflow-hidden rounded-xl py-4 font-semibold text-sm text-white tracking-wide transition-all duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                }}
              >
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-white/35 mt-6">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-semibold text-violet-400 hover:text-violet-300 transition-colors hover:underline underline-offset-2"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Bottom trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {['Secure', 'Encrypted', 'Private'].map((label) => (
            <div key={label} className="flex items-center gap-1.5 text-white/25 text-xs">
              <svg className="w-3.5 h-3.5 text-violet-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
