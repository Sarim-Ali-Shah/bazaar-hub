import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-bazaar-primary text-xl font-medium">Loading...</div>
      </div>
    );
  }

  // 1. Check if user is authenticated
  if (!isAuthenticated) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in but wrong role, redirect to home
    return <Navigate to="/" replace state={{ message: 'Access Denied: Insufficient role.' }} />;
  }

  // 3. Render the page content if authenticated and authorized
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ProtectedRoute;