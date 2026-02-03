import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaLock, FaUser, FaBuilding, FaEye, FaEyeSlash, FaStore, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EnhancedLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER', // Default role
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(formData.password)) {
      newErrors.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
    }
    
    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 20 || formData.name.length > 60) {
        newErrors.name = 'Name must be between 20 and 60 characters';
      }
      
      if (formData.address && formData.address.length > 400) {
        newErrors.address = 'Address must not exceed 400 characters';
      }
      
      if (!formData.role) {
        newErrors.role = 'Please select a role';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const result = isSignUp 
      ? await register(formData)
      : await login(formData);
    setLoading(false);
    
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'USER':
          navigate('/user/dashboard');
          break;
        case 'OWNER':
          navigate('/owner/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setErrors({ general: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaStore className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Rateify</h1>
              <p className="text-xl text-blue-100">Rate & Review Your Favorite Stores</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <p className="text-blue-100">Stores Listed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <p className="text-blue-100">Reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">4.5</div>
                  <p className="text-blue-100">Avg Rating</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="w-6 h-6 text-yellow-400" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Join our platform to rate and review stores'
                  : 'Welcome back! Please sign in to your account'
                }
              </p>
            </div>

            {/* Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{errors.general}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Role Selection (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to join as
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="relative">
                      <input
                        type="radio"
                        name="role"
                        value="USER"
                        checked={formData.role === 'USER'}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.role === 'USER'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500"></div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">Customer</p>
                            <p className="text-sm text-gray-500">Rate and review stores</p>
                          </div>
                        </div>
                      </div>
                    </label>
                    <label className="relative">
                      <input
                        type="radio"
                        name="role"
                        value="OWNER"
                        checked={formData.role === 'OWNER'}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.role === 'OWNER'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-500"></div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">Store Owner</p>
                            <p className="text-sm text-gray-500">Manage your store</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
              )}

              {/* Address Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFacebook className="h-5 w-5 text-blue-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaTwitter className="h-5 w-5 text-blue-400" />
              </motion.button>
            </div>

            {/* Toggle Sign In/Sign Up */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      address: '',
                      role: 'USER',
                    });
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedLogin;
