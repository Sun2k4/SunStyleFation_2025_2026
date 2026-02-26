import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  ArrowLeft,
  Tag,
  Ticket,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Tag, label: "Categories", path: "/admin/categories" },
    { icon: Ticket, label: "Coupons", path: "/admin/coupons" },
    { icon: Users, label: "Users", path: "/admin/users" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          <button onClick={onClose} className="md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>
        <nav className="px-4 space-y-1 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose()} // Close sidebar on mobile when link clicked
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${location.pathname === item.path
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
    </>
  );
};

export default Sidebar;
