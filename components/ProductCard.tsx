import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 lg:aspect-none group-hover:opacity-95 transition-opacity h-64 md:h-80 relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full transform group-hover:scale-105 transition-transform duration-500"
        />
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            New
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="absolute bottom-4 right-4 bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-500 hover:text-white"
        >
          <ShoppingBag size={20} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
             <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
             <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem]">
              <Link to={`/products/${product.id}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.name}
              </Link>
            </h3>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center mb-2">
            <Star className="text-yellow-400 fill-current w-4 h-4" />
            <span className="text-xs text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
          </div>
          <p className="text-lg font-bold text-primary-600">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
