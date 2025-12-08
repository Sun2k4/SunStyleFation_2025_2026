import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import Home from '../pages/public/Home';
import Shop from '../pages/public/Shop';
import ProductDetail from '../pages/public/ProductDetail';
import Cart from '../pages/public/Cart';
import UserLogin from '../pages/auth/UserLogin';
import AdminLogin from '../pages/auth/AdminLogin';
import Dashboard from '../pages/admin/Dashboard/index';
import AdminProducts from '../pages/admin/ProductManagement/index';
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
      <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
      <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
      <Route path="/checkout" element={<MainLayout><div className="text-center py-20 font-bold text-xl">Checkout Demo Placeholder</div></MainLayout>} />

      {/* Auth Routes */}
      <Route path="/login" element={<AuthLayout><UserLogin /></AuthLayout>} />
      <Route path="/admin/login" element={<AuthLayout><AdminLogin /></AuthLayout>} />

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