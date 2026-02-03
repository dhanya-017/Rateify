import React, { useState, useEffect } from 'react';
import { ownerAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const { logout } = useAuth();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Store Owner Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPasswordForm(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Change Password
              </button>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {dashboardData && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Overview</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{dashboardData.store.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">★</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Average Rating</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.averageRating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">R</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Ratings</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.totalRatings}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Customer Ratings</h2>
              <div className="flex space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="created_at">Sort by Date</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="user_name">Sort by Customer</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
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
                    {ratings.map((rating) => (
                      <tr key={rating.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rating.user_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rating.user_email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-2">{rating.rating}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= rating.rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {ratings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No ratings received yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showPasswordForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    required
                    pattern="^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
