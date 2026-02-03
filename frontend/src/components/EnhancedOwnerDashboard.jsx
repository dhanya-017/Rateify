import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaUsers, FaStar, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { ownerAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EnhancedOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { logout, user } = useAuth();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    fetchDashboardData();
    fetchRatings();
  }, [sortBy, sortOrder]);

  const fetchDashboardData = async () => {
    try {
      const response = await ownerAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchRatings = async () => {
    try {
      const params = {
        sort: sortBy,
        order: sortOrder,
      };
      const response = await ownerAPI.getRatings(params);
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FaStar key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(
          <FaStar key={i} className="w-4 h-4 text-yellow-400 opacity-50" />
        );
      } else {
        stars.push(
          <FaStar key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your store data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-lg font-bold text-gray-900">Store Dashboard</h1>
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
        <div className={`
          fixed lg:relative lg:translate-x-0 z-50 w-64 h-screen bg-white shadow-xl lg:shadow-md
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}>
          {/* Mobile Backdrop */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-sm text-gray-500">Store Owner</p>
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
                  <FaStore className="w-5 h-5" />
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
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Rateify</h1>
                  <p className="text-gray-600">Store Owner Dashboard</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome back, {user?.name?.split(' ')[0]}!</span>
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
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
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Store Overview */}
              {dashboardData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{dashboardData.store.name}</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Average Rating */}
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        {renderStars(parseFloat(dashboardData.averageRating))}
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.averageRating}</p>
                      <p className="text-sm text-gray-500">Average Rating</p>
                    </div>
                    
                    {/* Total Customers */}
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <FaUsers className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.totalRatings}</p>
                      <p className="text-sm text-gray-500">Total Ratings</p>
                    </div>
                    
                    {/* Store Status */}
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <FaStore className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">Open</p>
                      <p className="text-sm text-gray-500">Store Status</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Customer Ratings Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
              >
                {/* Table Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-xl font-semibold text-gray-900">Customer Ratings</h3>
                    <div className="flex items-center space-x-4">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="created_at">Sort by Date</option>
                        <option value="rating">Sort by Rating</option>
                        <option value="user_name">Sort by Customer</option>
                      </select>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ratings.length > 0 ? (
                        ratings.map((rating, index) => (
                          <motion.tr
                            key={rating.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {rating.user_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {rating.user_email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex mr-2">
                                  {renderStars(rating.rating)}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {rating.rating}.0
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(rating.created_at)}
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center">
                            <div className="text-gray-500">
                              <FaStar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg font-medium">No ratings yet</p>
                              <p className="text-sm">Customers haven't rated your store yet</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                {ratings.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{ratings.length}</span> customer{ratings.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
    </div>
  );
};

export default EnhancedOwnerDashboard;
