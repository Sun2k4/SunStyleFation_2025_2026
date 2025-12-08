import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../utils/constants';
import ProductCard from '../../components/user/ProductCard';

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
      <section className="bg-gray-900 py-20 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-4 py-1.5 mb-6 border border-gray-700">
                <Sparkles size={16} className="text-primary-400" />
                <span className="text-xs font-bold tracking-wider uppercase text-gray-300">Powered by Gemini AI</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Meet Sunny,<br />
                Your Personal <span className="text-primary-400">AI Stylist</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-lg">
                Not sure what to wear for that beach party or business meeting? Chat with Sunny anytime! Click the <span className="text-white font-bold inline-flex items-center gap-1 bg-primary-600 px-2 py-0.5 rounded-lg mx-1 text-sm"><Sparkles size={12}/> chat icon</span> in the bottom right corner to get instant, personalized outfit recommendations based on the weather and your occasion.
              </p>
              
              <div className="flex flex-wrap gap-4">
                 <div className="flex -space-x-4">
                    <img className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/100?img=1" alt="User" />
                    <img className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/100?img=5" alt="User" />
                    <img className="w-10 h-10 rounded-full border-2 border-gray-900" src="https://i.pravatar.cc/100?img=8" alt="User" />
                    <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 text-xs flex items-center justify-center font-bold">+2k</div>
                 </div>
                 <div className="flex flex-col justify-center">
                    <div className="text-sm font-bold">Happy Shoppers</div>
                    <div className="text-xs text-gray-500">using AI recommendations</div>
                 </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-500/20 rounded-full blur-[100px]"></div>
              <div className="relative bg-gray-800 rounded-3xl p-4 border border-gray-700 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                 {/* Mock Chat Interface Visual */}
                 <div className="bg-white rounded-2xl overflow-hidden shadow-inner">
                    <div className="bg-primary-500 p-4 flex items-center gap-3">
                       <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white"><Sparkles size={16}/></div>
                       <div className="text-white font-bold">Stylist Sunny</div>
                    </div>
                    <div className="p-4 space-y-3">
                       <div className="flex gap-2">
                          <div className="w-8 h-8 bg-primary-50 rounded-full flex-shrink-0"></div>
                          <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-gray-800 text-xs w-3/4">
                             Hi there! I see you're looking for a summer dress. Based on the 30°C forecast, I recommend our Floral Sundress! 🌸
                          </div>
                       </div>
                       <div className="flex gap-2 flex-row-reverse">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                          <div className="bg-primary-600 p-3 rounded-2xl rounded-tr-none text-white text-xs">
                             That sounds perfect! Can you show me accessories?
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <div className="w-8 h-8 bg-primary-50 rounded-full flex-shrink-0"></div>
                          <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-gray-800 text-xs w-3/4">
                             Absolutely! The Canvas Tote Bag and Classic Aviators would complete the look beautifully. ✨
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;