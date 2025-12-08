import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import AIOutfitAssistant from '../components/AIOutfitAssistant';

const Home: React.FC = () => {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Embrace the <span className="text-primary-400">SunStyle</span> <br/>
            Summer Collection 2024
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-xl">
            Discover lightweight fabrics, vibrant colors, and styles designed to keep you cool and chic under the sun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2">
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link to="/shop" className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-bold text-lg transition-all">
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-full">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-500">On all orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-green-50 text-green-600 p-3 rounded-full">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure transaction</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-full">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">24/7 Support</h3>
              <p className="text-sm text-gray-500">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-500 mt-2">Hot picks for this week</p>
          </div>
          <Link to="/shop" className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* AI Section */}
      <section className="bg-gray-900 py-16 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-400 font-bold tracking-wider uppercase mb-2 block">Powered by Gemini AI</span>
              <h2 className="text-4xl font-extrabold mb-6">Not sure what to wear?</h2>
              <p className="text-gray-400 text-lg mb-8">
                Let our AI stylist 'Sunny' curate the perfect outfit for your specific occasion and weather conditions.
              </p>
              <div className="text-gray-900">
                 <AIOutfitAssistant />
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-primary-500/30 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" 
                alt="Stylist" 
                className="relative rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
