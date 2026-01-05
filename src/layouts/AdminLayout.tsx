import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/admin/Sidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile Header for Admin */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <Link to="/" className="text-sm font-medium text-primary-600">Back to Store</Link>
      </div>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;