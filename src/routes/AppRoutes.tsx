import { lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

// ─── Lazy-loaded Pages (Code Splitting) ───
const Home = lazy(() => import("../pages/public/Home"));
const Shop = lazy(() => import("../pages/public/Shop"));
const ProductDetail = lazy(() => import("../pages/public/ProductDetail"));
const Cart = lazy(() => import("../pages/public/Cart"));
const Checkout = lazy(() => import("../pages/public/Checkout"));
const PaymentSuccess = lazy(() => import("../pages/public/PaymentSuccess"));
const PaymentCancel = lazy(() => import("../pages/public/PaymentCancel"));
const UserProfile = lazy(() => import("../pages/public/UserProfile"));
const Wishlist = lazy(() => import("../pages/public/Wishlist"));
const UserLogin = lazy(() => import("../pages/auth/UserLogin"));
const AdminLogin = lazy(() => import("../pages/auth/AdminLogin"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard/index"));
const AdminProducts = lazy(() => import("../pages/admin/ProductManagement/index"));
const AdminUsers = lazy(() => import("../pages/admin/UserManagement/index"));
const AdminOrders = lazy(() => import("../pages/admin/OrderManagement/index"));
const CategoryManagement = lazy(() => import("../pages/admin/CategoryManagement/CategoryManagement"));


// ─── Loading Fallback ───
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

// ─── 404 Not Found ───
const NotFound = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-4xl">🔍</span>
      </div>
      <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-700 mb-3">Không tìm thấy trang</h2>
      <p className="text-gray-500 mb-8">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          to="/"
          className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg"
        >
          Về trang chủ
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 bg-white text-gray-900 rounded-full font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Cửa hàng
        </Link>
      </div>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
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

        {/* 404 - Not Found */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />
      </Routes>
    </Suspense>
  );
};
