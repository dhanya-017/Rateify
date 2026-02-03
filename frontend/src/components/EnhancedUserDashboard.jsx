import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { userAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StoreCard from './StoreCard';
import SearchAndFilter from './SearchAndFilter';

const EnhancedUserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { logout, user } = useAuth();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    fetchStores();
  }, [searchTerm, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        sort: sortBy,
        order: sortOrder,
      };
      const response = await userAPI.getStores(params);
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = async (storeId, rating) => {
    try {
      setRatingLoading(true);
      await userAPI.submitRating({ storeId, rating: parseInt(rating) });
      await fetchStores(); // Refresh stores to update the rating display
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setRatingLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await authAPI.changePassword(passwordData);
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
      alert('Password changed successfully');
    } catch (error) {
      alert('Error changing password: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-gray-900">Store Rating</h1>
          </div>
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(isMobileMenuOpen || window.innerWidth >= 1024) && (
            <>
              {/* Mobile Backdrop */}
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                />
              )}
              
              {/* Sidebar Content */}
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`
                  fixed lg:relative lg:translate-x-0 z-50 w-64 h-screen bg-white shadow-xl lg:shadow-md
                  ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
              >
                <div className="flex flex-col h-full">
                  {/* Sidebar Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{user?.name}</h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4">
                    <div className="space-y-2">
                      <a
                        href="#dashboard"
                        className="flex items-center space-x-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg"
                      >
                        <FaHome className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                      </a>
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <FaCog className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                      </button>
                    </div>
                  </nav>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Rateify</h1>
                  <p className="text-gray-600 mt-1">Rate and review your favorite places</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome back, {user?.name?.split(' ')[0]}!</span>
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Search and Filter */}
              <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={setSortOrder}
                setSortOrder={setSortOrder}
                totalResults={stores.length}
              />

              {/* Store Cards Grid */}
              {stores.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {stores.map((store) => (
                    <motion.div key={store.id} variants={itemVariants}>
                      <StoreCard
                        store={store}
                        onRateChange={handleRatingChange}
                        isLoading={ratingLoading}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaSearch className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      pattern="^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      8-16 characters with at least one uppercase letter and one special character
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedUserDashboard;
