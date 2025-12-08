import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: 'user' | 'admin') => {
    login(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
        <div>
           <div className="mx-auto h-16 w-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
             S
           </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome to SunStyle</h2>
          <p className="mt-2 text-gray-500">Select a role to experience the platform.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('user')}
            className="group relative w-full flex items-center p-4 border border-gray-200 rounded-2xl hover:border-primary-500 hover:ring-1 hover:ring-primary-500 transition-all bg-white hover:bg-primary-50"
          >
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
              <User size={24} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-gray-900">Customer</h3>
              <p className="text-sm text-gray-500">Shop products, use AI, manage cart</p>
            </div>
            <ArrowRight size={20} className="text-gray-300 group-hover:text-primary-500" />
          </button>

          <button
            onClick={() => handleLogin('admin')}
            className="group relative w-full flex items-center p-4 border border-gray-200 rounded-2xl hover:border-red-500 hover:ring-1 hover:ring-red-500 transition-all bg-white hover:bg-red-50"
          >
            <div className="bg-red-100 text-red-600 p-3 rounded-xl mr-4 group-hover:bg-red-200 transition-colors">
              <ShieldCheck size={24} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-gray-900">Admin</h3>
              <p className="text-sm text-gray-500">Manage products, orders, and stats</p>
            </div>
            <ArrowRight size={20} className="text-gray-300 group-hover:text-red-500" />
          </button>
        </div>
        
        <p className="text-xs text-gray-400 mt-8">
          This is a demonstration build. No actual authentication is performed.
        </p>
      </div>
    </div>
  );
};

export default Login;
