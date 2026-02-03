import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  LogOut,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-primary-500 text-white p-1.5 rounded-lg">
                <Sun size={24} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                SunStyle
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/shop"
                className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('nav.shop')}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-primary-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium bg-primary-50 transition-colors"
                >
                  {t('nav.admin')}
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-400 hover:text-red-500 relative transition-colors"
              title="Yêu thích"
            >
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-gray-400 hover:text-primary-600 relative transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-full transition-colors"
                >
                  <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full border border-gray-200"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
            >
              {t('nav.shop')}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="text-primary-600 hover:bg-primary-50 block px-3 py-2 rounded-md text-base font-medium"
              >
                {t('nav.admin')}
              </Link>
            )}
            {user && (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              >
                {t('nav.profile')}
              </Link>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200">
            {user ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatarUrl}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-gray-800">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-500 mt-1">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-red-500"
                >
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                >
                  {t('nav.signIn')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
