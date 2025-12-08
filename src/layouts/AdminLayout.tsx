import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar />
      {/* Mobile Header for Admin */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center">
         <span className="font-bold">Admin Panel</span>
         <Link to="/" className="text-sm text-primary-600">Back to Store</Link>
      </div>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;