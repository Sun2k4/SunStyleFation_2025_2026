import React from 'react';
import { Sun, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary-500 text-white p-1.5 rounded-lg">
                <Sun size={20} />
              </div>
              <span className="font-bold text-xl text-gray-900">SunStyle</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your daily dose of sunshine and fashion. We bring you the latest summer trends all year round.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/shop" className="hover:text-primary-600">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-primary-600">Men</Link></li>
              <li><Link to="/shop" className="hover:text-primary-600">Women</Link></li>
              <li><Link to="/shop" className="hover:text-primary-600">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary-600">About Us</a></li>
              <li><a href="#" className="hover:text-primary-600">Careers</a></li>
              <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Stay Connected</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Instagram size={20} /></a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail size={16} /> support@sunstyle.com
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} SunStyle Fashion Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;