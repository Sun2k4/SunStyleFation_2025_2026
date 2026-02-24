import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import ProductCard from '../../components/user/ProductCard';
import SkeletonProductCard from '../../components/common/SkeletonProductCard';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, Category } from '../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
];

const Shop: React.FC = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsInitialLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
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

  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isInitialLoading) return;
    let timer: NodeJS.Timeout;
    setIsFiltering(true);
    timer = setTimeout(() => setIsFiltering(false), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = activeCategory === 'All' || product.categoryName === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        default: return 0;
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsFiltering(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await delay(300);
      setCurrentPage(page);
      setIsFiltering(false);
    }
  };

  const isLoading = isInitialLoading || isFiltering;

  const getProductCount = (categoryName: string) => {
    if (categoryName === 'All') return products.length;
    return products.filter(p => p.categoryName === categoryName).length;
  };

  const categoryIcons: Record<string, string> = {
    'Men': '👔',
    'Women': '👗',
    'Footwear': '👟',
    'Accessories': '👜',
    'Outerwear': '🧥',
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Cửa Hàng
            </h1>
            <p className="mt-3 text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              Khám phá bộ sưu tập thời trang đa dạng với hàng trăm sản phẩm chất lượng
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                ✨ Miễn phí vận chuyển
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                🔄 Đổi trả 30 ngày
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category Cards - Prominent Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {/* All */}
            <button
              onClick={() => handleCategoryChange('All')}
              className={`group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl transition-all duration-300 ${activeCategory === 'All'
                ? 'bg-gray-900 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:scale-102 border border-gray-100'
                }`}
            >
              <span className="text-3xl sm:text-4xl mb-2">🛍️</span>
              <span className="font-semibold text-sm">Tất cả</span>
              <span className={`text-xs mt-1 ${activeCategory === 'All' ? 'text-gray-300' : 'text-gray-400'}`}>
                {getProductCount('All')} SP
              </span>
            </button>

            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.name)}
                className={`group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl transition-all duration-300 ${activeCategory === category.name
                  ? 'bg-gray-900 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:scale-102 border border-gray-100'
                  }`}
              >
                <span className="text-3xl sm:text-4xl mb-2">{categoryIcons[category.name] || '🏷️'}</span>
                <span className="font-semibold text-sm">{category.name}</span>
                <span className={`text-xs mt-1 ${activeCategory === category.name ? 'text-gray-300' : 'text-gray-400'}`}>
                  {getProductCount(category.name)} SP
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar: Search, Sort, Count */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              {isLoading ? (
                <span className="inline-block w-20 h-4 bg-gray-200 rounded animate-pulse"></span>
              ) : (
                <><span className="font-bold text-gray-900">{filteredProducts.length}</span> sản phẩm</>
              )}
            </p>

            <div className="flex items-center gap-3">
              {/* Search - More Prominent */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full sm:w-72 pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="hidden sm:inline">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <span className="sm:hidden">Sắp xếp</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)}></div>
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                      {sortOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 ${sortBy === option.value ? 'bg-gray-100 font-medium' : ''
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonProductCard key={index} />
            ))}
          </div>
        ) : currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm nào</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="text-sm font-medium text-gray-900 underline"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;