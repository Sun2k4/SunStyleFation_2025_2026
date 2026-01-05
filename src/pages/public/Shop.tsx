import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/user/ProductCard';
import SkeletonProductCard from '../../components/common/SkeletonProductCard';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, Category } from '../../types';

// Helper for artificial delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Loading States
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Initial Fetch
  useEffect(() => {
    const fetchProducts = async () => {
      setIsInitialLoading(true);
      try {
        // Parallel fetch and minimum loading time for smooth UX
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
          delay(1200) // Minimum 1.2s initial load
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch products/categories", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Category Change with Delay
  const handleCategoryChange = async (category: string) => {
    if (category === activeCategory) return;

    setIsFiltering(true);
    setActiveCategory(category);
    // Simulate network request for category switch
    await delay(800);
    setIsFiltering(false);
  };

  // Handle Search with Debounce Effect
  useEffect(() => {
    // Only trigger loading effect if there is a query or if clearing query
    // This allows "typing" to feel responsive but "results" to feel calculated
    let timer: NodeJS.Timeout;

    // Don't trigger on initial mount (when it's empty)
    if (isInitialLoading) return;

    setIsFiltering(true);
    timer = setTimeout(() => {
      setIsFiltering(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery]); // Note: In real app, we'd debounce the searchQuery state update itself or the API call

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.categoryName === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsFiltering(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await delay(600); // Small delay for page processing feel
      setCurrentPage(page);
      setIsFiltering(false);
    }
  };

  const isLoading = isInitialLoading || isFiltering;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Shop Collection</h1>
          <p className="text-gray-500 mt-2 text-lg min-h-[1.75rem]">
            {isLoading ? (
              <span className="inline-block w-32 h-6 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              `Showing ${filteredProducts.length} premium items`
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-72">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none w-full bg-gray-50 focus:bg-white transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex overflow-x-auto pb-6 mb-6 gap-3 scrollbar-hide">
        <button
          onClick={() => handleCategoryChange('All')}
          className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 transform hover:scale-105 ${activeCategory === 'All'
            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 ring-2 ring-gray-900 ring-offset-2'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.name)}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 transform hover:scale-105 ${activeCategory === category.name
              ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 ring-2 ring-gray-900 ring-offset-2'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      ) : currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2 mx-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === page
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <SlidersHorizontal className="text-gray-400 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            We couldn't find any items matching your criteria. Try adjusting your search or category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Shop;