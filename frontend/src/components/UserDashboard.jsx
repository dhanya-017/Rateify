import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { logout } = useAuth();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    fetchStores();
  }, [searchTerm, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
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
      await userAPI.submitRating({ storeId, rating: parseInt(rating) });
      fetchStores();
    } catch (error) {
      console.error('Error submitting rating:', error);
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
        <div className="text-xl">Loading stores...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Store Rating Platform</h1>
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
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Stores</h2>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Search by name or address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="address">Sort by Address</option>
                  <option value="average_rating">Sort by Rating</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div key={store.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
                  <p className="text-gray-600 mb-4">{store.address}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Overall Rating:</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{parseFloat(store.average_rating).toFixed(1)}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(parseFloat(store.average_rating))
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
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating: {store.user_rating || 'Not rated'}
                    </label>
                    <select
                      value={store.user_rating || ''}
                      onChange={(e) => handleRatingChange(store.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {stores.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No stores found matching your search criteria.</p>
              </div>
            )}
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

export default UserDashboard;
