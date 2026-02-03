import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import KPICards from './KPICards';
import RatingsChart from './RatingsChart';
import UserManagement from './UserManagement';
import StoreManagement from './StoreManagement';
import EnhancedUserTable from './EnhancedUserTable';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome back, Admin
                </span>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Monitor your platform's performance and key metrics</p>
              </div>
              
              <KPICards dashboardData={dashboardData} />
              <RatingsChart />
              
              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">New user registered</span>
                    <span className="text-sm text-gray-400 ml-auto">2 minutes ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">New store added</span>
                    <span className="text-sm text-gray-400 ml-auto">15 minutes ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">New rating submitted</span>
                    <span className="text-sm text-gray-400 ml-auto">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rateify Admin Panel</h1>
                <p className="text-gray-600 mt-1">Manage platform users and their permissions</p>
              </div>
              <EnhancedUserTable />
            </div>
          )}

          {activeTab === 'stores' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
                <p className="text-gray-600 mt-1">Manage registered stores and their information</p>
              </div>
              <StoreManagement />
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ratings Overview</h1>
                <p className="text-gray-600 mt-1">View and analyze all platform ratings</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-gray-600">Ratings management features coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
