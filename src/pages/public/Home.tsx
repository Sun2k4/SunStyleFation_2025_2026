import React, { useEffect, useState } from 'react';
import { Truck, Shield, Clock, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';

// Import new home components
import {
  HeroSection,
  CategoryShowcase,
  ProductCarousel,
  Testimonials,
  Newsletter,
} from '../../components/home';

const Home: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [arrivals, sellers] = await Promise.all([
          productService.getNewArrivals(8),
          productService.getBestSellers(8),
        ]);
        setNewArrivals(arrivals);
        setBestSellers(sellers);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video & Countdown */}
      <HeroSection />

      {/* Features Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 p-4 rounded-xl">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-500">On all orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all">
            <div className="bg-gradient-to-br from-green-50 to-green-100 text-green-600 p-4 rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure transaction</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 p-4 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">24/7 Support</h3>
              <p className="text-sm text-gray-500">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <CategoryShowcase />

      {/* New Arrivals Carousel */}
      <ProductCarousel
        title="New Arrivals"
        subtitle="Fresh drops just for you"
        products={newArrivals}
        loading={loading}
        viewAllLink="/shop?sort=newest"
      />

      {/* Best Sellers / Trending */}
      <section className="bg-gray-50 py-4">
        <ProductCarousel
          title="Trending Now"
          subtitle="Hot picks this season"
          products={bestSellers}
          loading={loading}
          viewAllLink="/shop?sort=popular"
        />
      </section>

      {/* AI Stylist Section */}
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
                Not sure what to wear? Chat with Sunny anytime! Click the{' '}
                <span className="text-white font-bold inline-flex items-center gap-1 bg-primary-600 px-2 py-0.5 rounded-lg mx-1 text-sm">
                  <Sparkles size={12} />chat icon
                </span>{' '}
                in the bottom right corner to get instant, personalized outfit recommendations.
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
                <div className="bg-white rounded-2xl overflow-hidden shadow-inner">
                  <div className="bg-primary-500 p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white"><Sparkles size={16} /></div>
                    <div className="text-white font-bold">Stylist Sunny</div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-primary-50 rounded-full flex-shrink-0"></div>
                      <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-gray-800 text-xs w-3/4">
                        Hi there! Based on the 30°C forecast, I recommend our Floral Sundress! 🌸
                      </div>
                    </div>
                    <div className="flex gap-2 flex-row-reverse">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="bg-primary-600 p-3 rounded-2xl rounded-tr-none text-white text-xs">
                        Perfect! Can you show me accessories?
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-primary-50 rounded-full flex-shrink-0"></div>
                      <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-gray-800 text-xs w-3/4">
                        The Canvas Tote and Aviators would complete the look! ✨
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;