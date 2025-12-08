import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login('admin');
    navigate('/admin');
  };

  return (
    <div className="text-center space-y-6">
      <div>
         <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
           <ShieldCheck size={24} />
         </div>
         <h2 className="text-3xl font-extrabold text-gray-900">Admin Portal</h2>
         <p className="mt-2 text-gray-500">Secure access for store managers</p>
      </div>

      <button
        onClick={handleLogin}
        className="group relative w-full flex items-center p-4 border border-gray-200 rounded-2xl hover:border-red-500 hover:ring-1 hover:ring-red-500 transition-all bg-white hover:bg-red-50"
      >
        <div className="bg-red-100 text-red-600 p-3 rounded-xl mr-4 group-hover:bg-red-200 transition-colors">
          <ShieldCheck size={24} />
        </div>
        <div className="text-left flex-1">
          <h3 className="font-bold text-gray-900">Login as Admin</h3>
          <p className="text-sm text-gray-500">Manage products & orders</p>
        </div>
        <ArrowRight size={20} className="text-gray-300 group-hover:text-red-500" />
      </button>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          Not an admin? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Go to Customer Login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;