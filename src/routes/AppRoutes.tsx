import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/public/Home";
import Shop from "../pages/public/Shop";
import ProductDetail from "../pages/public/ProductDetail";
import Cart from "../pages/public/Cart";
import Checkout from "../pages/public/Checkout";
import PaymentSuccess from "../pages/public/PaymentSuccess";
import PaymentCancel from "../pages/public/PaymentCancel";
import UserProfile from "../pages/public/UserProfile";
import Wishlist from "../pages/public/Wishlist";
import UserLogin from "../pages/auth/UserLogin";
import AdminLogin from "../pages/auth/AdminLogin";
import Dashboard from "../pages/admin/Dashboard/index";
import AdminProducts from "../pages/admin/ProductManagement/index";
import AdminUsers from "../pages/admin/UserManagement/index";
import AdminOrders from "../pages/admin/OrderManagement/index";
import CategoryManagement from "../pages/admin/CategoryManagement/CategoryManagement";
import DatabaseUtility from "../pages/admin/DatabaseUtility/index";
import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/shop"
        element={
          <MainLayout>
            <Shop />
          </MainLayout>
        }
      />
      <Route
        path="/wishlist"
        element={
          <MainLayout>
            <Wishlist />
          </MainLayout>
        }
      />
      <Route
        path="/products/:id"
        element={
          <MainLayout>
            <ProductDetail />
          </MainLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <MainLayout>
            <Cart />
          </MainLayout>
        }
      />

      {/* Protected User Routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Checkout />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <UserProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Payment Routes */}
      <Route
        path="/payment/success"
        element={
          <MainLayout>
            <PaymentSuccess />
          </MainLayout>
        }
      />
      <Route
        path="/payment/cancel"
        element={
          <MainLayout>
            <PaymentCancel />
          </MainLayout>
        }
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <UserLogin />
          </AuthLayout>
        }
      />
      <Route
        path="/admin/login"
        element={
          <AuthLayout>
            <AdminLogin />
          </AuthLayout>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <CategoryManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/database"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <DatabaseUtility />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Placeholders for other admin pages */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <div className="flex items-center justify-center h-full text-gray-400">
                Page Not Found
              </div>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
