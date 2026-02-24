import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { useWishlist } from '../../context/WishlistContext';
import { PLACEHOLDER_IMAGE, handleImageError } from '../../utils/placeholderImage';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  // Badge - only show "Mới" for new products
  const badge = product.isNew ? { text: 'Mới', bg: 'bg-emerald-500' } : null;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image || PLACEHOLDER_IMAGE}
            alt={product.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
          />
        </Link>

        {/* Badge - Top Left */}
        {badge && (
          <div className={`absolute top-3 left-3 ${badge.bg} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm`}>
            {badge.text}
          </div>
        )}

        {/* Wishlist Button - Always Visible */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${inWishlist
            ? 'bg-red-500 text-white scale-110'
            : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white hover:scale-110'
            }`}
          title={inWishlist ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
        </button>

        {/* Quick View Button - On Hover */}
        <Link
          to={`/products/${product.id}`}
          className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-900 hover:text-white shadow-lg"
        >
          <ShoppingBag size={16} />
          <span>Xem chi tiết</span>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-medium">
          {product.categoryName || 'Uncategorized'}
        </p>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] leading-tight">
          <Link to={`/products/${product.id}`} className="hover:text-primary-600 transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto">
          {/* Rating */}
          {product.rating && product.rating > 0 ? (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`${i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200 fill-gray-200'
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews || 0})</span>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mb-2">Chưa có đánh giá</p>
          )}

          {/* Price */}
          <p className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;