import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ArrowLeft,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 min-h-screen hidden md:flex flex-col">
      <div className="p-6">
        <span className="text-xl font-bold text-gray-900">Admin Panel</span>
      </div>
      <nav className="px-4 space-y-1 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              location.pathname === item.path
                ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 mt-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Store
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
