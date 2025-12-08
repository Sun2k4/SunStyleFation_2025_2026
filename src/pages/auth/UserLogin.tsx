import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login('user');
    navigate('/');
  };

  return (
    <div className="text-center space-y-6">
      <div>
         <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
         <p className="mt-2 text-gray-500">Sign in to your customer account</p>
      </div>

      <button
        onClick={handleLogin}
        className="group relative w-full flex items-center p-4 border border-gray-200 rounded-2xl hover:border-primary-500 hover:ring-1 hover:ring-primary-500 transition-all bg-white hover:bg-primary-50"
      >
        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
          <User size={24} />
        </div>
        <div className="text-left flex-1">
          <h3 className="font-bold text-gray-900">Continue as Customer</h3>
          <p className="text-sm text-gray-500">Access your orders and wishlist</p>
        </div>
        <ArrowRight size={20} className="text-gray-300 group-hover:text-primary-500" />
      </button>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          Are you an administrator? <Link to="/admin/login" className="text-primary-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;