import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from '../layout/header/index';
import Footer from '../layout/footer/index';
import AdminSidebar from '../layout/sidebar/index';
import Home from '../home-page/index';
import Shop from '../shop/index';
import ProductDetail from '../detail/index';
import Cart from '../cart/index';
import Login from '../login/index';
import Dashboard from '../admin/Dashboard';
import AdminProducts from '../admin/AdminProducts';
import AIOutfitAssistant from '../common/AIOutfitAssistant'; // Import the global chatbot
import { useAuth } from '../../app/AuthContext';

// Public Layout
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow bg-white relative">
      {children}
    </main>
    <Footer />
    {/* Global Floating Chatbot */}
    <AIOutfitAssistant />
  </div>
);

// Admin Layout
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />
      {/* Mobile Header for Admin */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center">
         <span className="font-bold">Admin Panel</span>
         <Link to="/" className="text-sm text-primary-600">Back to Store</Link>
      </div>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
      <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout><div className="text-center py-20 font-bold text-xl">Checkout Demo Placeholder</div></PublicLayout>} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminLayout><Dashboard /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute adminOnly>
          <AdminLayout><AdminProducts /></AdminLayout>
        </ProtectedRoute>
      } />
      {/* Placeholders for other admin pages */}
       <Route path="/admin/*" element={
        <ProtectedRoute adminOnly>
          <AdminLayout><div className="flex items-center justify-center h-full text-gray-400">Work in Progress</div></AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};