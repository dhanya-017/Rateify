import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import EnhancedLogin from './components/EnhancedLogin';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import EnhancedUserDashboard from './components/EnhancedUserDashboard';
import EnhancedOwnerDashboard from './components/EnhancedOwnerDashboard';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <EnhancedLogin /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/user/dashboard" element={
        <ProtectedRoute requiredRole="USER">
          <EnhancedUserDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/owner/dashboard" element={
        <ProtectedRoute requiredRole="OWNER">
          <EnhancedOwnerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={`/${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role.toLowerCase() : 'user'}/dashboard`} />
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
