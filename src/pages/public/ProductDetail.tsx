import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Share2,
  Loader2,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { productService } from "../../services/productService";
import { Product } from "../../types";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.getProductById(Number(id));
        setProduct(data || null);
        if (data) setSelectedImage(data.image);
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-50 p-6 rounded-full mb-4">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">The product you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/shop" className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <nav className="flex items-center text-sm font-medium text-gray-500 mb-8">
        <Link to="/shop" className="hover:text-gray-900 transition-colors flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
        <span className="mx-3">/</span>
        <span className="text-gray-900">{product.categoryName || 'Uncategorized'}</span>
        <span className="mx-3">/</span>
        <span className="truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        {/* Gallery Section */}
        <div className="space-y-6">
          <div className="aspect-w-4 aspect-h-5 rounded-3xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100 group">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedImage(product.image)}
              className={`aspect-w-1 aspect-h-1 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${selectedImage === product.image ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : 'border-transparent hover:border-gray-300'
                }`}
            >
              <img src={product.image} alt="Main" className="w-full h-full object-cover" />
            </button>
            {[1, 2, 3].map((i) => {
              const imgUrl = `https://picsum.photos/seed/${product.slug}${i}/400/400`;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`aspect-w-1 aspect-h-1 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${selectedImage === imgUrl ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : 'border-transparent hover:border-gray-300'
                    }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 uppercase tracking-widest">
              {product.categoryName || 'Uncategorized'}
            </span>
            {product.isNew && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 uppercase tracking-widest">
                New Arrival
              </span>
            )}
          </div>

          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-end gap-3">
              <p className="text-4xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              {/* Simulated discount for visual appeal if needed later */}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-bold text-gray-900">{product.rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 text-sm font-medium">{product.reviews} reviews</span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            {product.description}
          </p>

          <div className="space-y-8 mb-8">
            {/* Color Selector */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Select Color</h3>
              <div className="flex gap-4">
                {/* Get unique colors from variants or use defaults */}
                {(product?.variants && product.variants.length > 0
                  ? [...new Set(product.variants.map(v => v.color))]
                  : ['Black', 'White', 'Blue', 'Gray']
                ).map((colorName) => (
                  <button
                    key={colorName}
                    onClick={() => setSelectedColor(colorName)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedColor === colorName
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 text-gray-900 hover:border-gray-400'
                      }`}
                  >
                    {colorName}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Select Size</h3>
                <button className="text-sm text-primary-600 font-medium hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {/* Get unique sizes from variants or use defaults */}
                {(product?.variants && product.variants.length > 0
                  ? [...new Set(product.variants.map(v => v.size))]
                  : ["S", "M", "L", "XL"]
                ).map((size) => {
                  // Check if this size/color combination is available
                  const variant = product?.variants?.find(
                    v => v.size === size && v.color === selectedColor
                  );
                  const isAvailable = variant && (variant.stock_quantity || 0) > 0;

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={product?.variants && product.variants.length > 0 && !isAvailable}
                      className={`h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all border-2 ${selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                        : isAvailable || !product?.variants
                          ? 'border-gray-200 text-gray-900 hover:border-gray-400 hover:bg-gray-50'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {/* Show stock info for selected variant */}
              {product?.variants && product.variants.length > 0 && (() => {
                const selectedVariant = product.variants.find(
                  v => v.size === selectedSize && v.color === selectedColor
                );
                return selectedVariant ? (
                  <p className="text-sm text-gray-600 mt-2">
                    Stock: <span className={selectedVariant.stock_quantity > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {selectedVariant.stock_quantity || 0} units
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-red-600 mt-2">This combination is not available</p>
                );
              })()}
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={async () => {
                if (!product) return;
                setAddingToCart(true);
                try {
                  // Find matching variant based on selected size and color
                  const selectedVariant = product.variants?.find(
                    v => v.size === selectedSize && v.color === selectedColor
                  );

                  if (selectedVariant) {
                    // Use actual variant from database
                    await addToCart(selectedVariant.id);
                    alert(`Added ${product.name} (${selectedSize}, ${selectedColor}) to cart!`);
                  } else {
                    // Fallback: No variants in database yet
                    // This happens if products were created before variant system
                    alert('⚠️ This product doesn\'t have size/color variants yet. Please contact admin to add variants.');
                    console.warn('Product has no variants:', product.id);
                  }
                } catch (error) {
                  console.error('Error adding to cart:', error);
                  alert('Failed to add to cart. Please try again.');
                } finally {
                  setAddingToCart(false);
                }
              }}
              disabled={addingToCart || !product?.variants || product.variants.length === 0}
              className="flex-1 bg-gray-900 text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <><ShoppingBag className="w-5 h-5" /> Add to Cart</>
              )}
            </button>
            <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
              <Heart className="w-6 h-6" />
            </button>
            <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200 transition-all">
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 mt-auto">
            <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50 rounded-2xl">
              <Truck className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50 rounded-2xl">
              <RotateCcw className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600">30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
