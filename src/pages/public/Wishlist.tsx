import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/currency';

const Wishlist: React.FC = () => {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Chưa có sản phẩm yêu thích</h2>
                    <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào danh sách yêu thích của bạn</p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                        <ShoppingBag size={20} />
                        Khám phá cửa hàng
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
                        <p className="text-gray-500 mt-1">{wishlist.length} sản phẩm</p>
                    </div>
                    {wishlist.length > 0 && (
                        <button
                            onClick={clearWishlist}
                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                        >
                            Xóa tất cả
                        </button>
                    )}
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlist.map(product => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={16} className="text-red-500" />
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                    {product.categoryName}
                                </p>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors"
                                >
                                    {product.name}
                                </Link>
                                <p className="text-lg font-bold text-primary-600 mt-2">
                                    {formatPrice(product.price)}
                                </p>
                                <Link
                                    to={`/products/${product.id}`}
                                    className="mt-3 block w-full text-center py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
