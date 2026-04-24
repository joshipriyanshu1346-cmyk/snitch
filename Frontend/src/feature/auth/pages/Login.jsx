import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }
    try {
      await handleLogin({ email, password });
      navigate("/dashboard");
    } catch (error) {
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-neutral-950">
      {/* Left - Image (desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&h=1600&fit=crop&q=80"
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
            Discover the latest<br />in men's fashion.
          </h2>
          <p className="text-sm text-white/60 mt-3 max-w-sm">
            Premium quality clothing designed for the modern man. Join 50,000+ customers.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:mb-12">
            <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center">
              <span className="text-base font-bold text-white dark:text-black font-[Poppins]">S</span>
            </div>
            <span className="text-lg font-bold text-black dark:text-white tracking-tight font-[Poppins]">SNITCH</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white font-[Poppins]">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-2 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className={`flex items-center rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-neutral-900 ${
                focused === "email" ? "border-black dark:border-white" : "border-gray-200 dark:border-neutral-800"
              }`}>
                <div className="pl-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-3.5 px-3 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className={`flex items-center rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-neutral-900 ${
                focused === "password" ? "border-black dark:border-white" : "border-gray-200 dark:border-neutral-800"
              }`}>
                <div className="pl-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm py-3.5 px-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-orange-500 hover:underline underline-offset-2 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
