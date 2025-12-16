import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  adminOnly?: boolean;
}> = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1. QUAN TRỌNG: Chờ cho đến khi Supabase check xong session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // 2. Sau khi load xong, nếu chưa đăng nhập -> Chuyển về login
  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace />;
  }

  // 3. Nếu là trang Admin nhưng user role không phải admin -> Chuyển về trang chủ
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
