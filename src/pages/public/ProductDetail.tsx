import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, Heart, Share2, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.getProductById(Number(id));
        setProduct(data || null);
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
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-primary-600 hover:underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <div className="aspect-w-3 aspect-h-4 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                <img 
                   src={`https://picsum.photos/seed/${product.slug}${i}/200/200`} 
                   alt="Thumbnail" 
                   className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600 tracking-wider uppercase">{product.category}</span>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 transition-colors">
                <Heart size={20} />
              </button>
              <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-blue-500 transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-200"} />
              ))}
            </div>
            <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
          </div>

          <p className="text-3xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex gap-3">
                {['bg-gray-900', 'bg-blue-800', 'bg-red-700', 'bg-yellow-500'].map((color, i) => (
                   <button key={i} className={`w-8 h-8 rounded-full ${color} ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 focus:ring-gray-900 transition-all`}></button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                   <button key={size} className="w-12 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all">
                     {size}
                   </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-transform transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} /> Add to Cart
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
             <div>
                <span className="block text-xs text-gray-500 uppercase">Availability</span>
                <span className="text-sm font-medium text-green-600">In Stock ({product.stock})</span>
             </div>
             <div>
                <span className="block text-xs text-gray-500 uppercase">SKU</span>
                <span className="text-sm font-medium text-gray-900">SUN-{product.id}-24</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;