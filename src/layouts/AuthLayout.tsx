import React from 'react';
import { Link } from 'react-router-dom';
import { Sun } from 'lucide-react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="bg-primary-500 text-white p-2 rounded-xl">
          <Sun size={28} />
        </div>
        <span className="font-bold text-2xl text-gray-900 tracking-tight">SunStyle</span>
      </Link>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        {children}
      </div>
      <div className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SunStyle Fashion Store
      </div>
    </div>
  );
};

export default AuthLayout;