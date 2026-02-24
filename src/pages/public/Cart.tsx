import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';
import { PLACEHOLDER_IMAGE, handleImageError } from '../../utils/placeholderImage';

const Cart: FC = () => {
  const { t } = useTranslation();
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const FREE_SHIPPING_THRESHOLD = 500;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="bg-gray-50 p-6 rounded-full mb-6">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">{t('cart.emptyDesc')}</p>
        <Link to="/shop" className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          {t('cart.startShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t('cart.title')}</h1>
        <span className="text-gray-500 font-medium">{cart.reduce((acc, item) => acc + item.quantity, 0)} {t('cart.items')}</span>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 relative">
        <div className="lg:col-span-8">
          {/* Free Shipping Progress */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Truck className={`w-5 h-5 ${progress === 100 ? 'text-green-500' : 'text-gray-900'}`} />
                <span className="font-bold text-gray-900">
                  {progress === 100 ? t('cart.freeShippingUnlocked') : t('cart.addMore', { amount: (FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(2) })}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {cart.map((item) => {
              const productPrice = item.product?.price || 0;
              const priceAdjustment = item.variant?.price_adjustment || 0;
              const finalPrice = productPrice + priceAdjustment;

              return (
                <div key={item.id} className="group flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 relative">
                    <img src={item.product?.image || PLACEHOLDER_IMAGE} alt={item.product?.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={handleImageError} />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl mb-1">
                          <Link to={`/products/${item.product?.id}`} className="hover:text-primary-600 transition-colors">{item.product?.name}</Link>
                        </h3>
                        <div className="flex gap-2 items-center">
                          <p className="text-sm font-medium text-gray-500 bg-gray-50 inline-block px-2 py-1 rounded-md">{item.product?.categoryName || 'N/A'}</p>
                          {item.variant && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Size:</span> {item.variant.size} | <span className="font-medium">Color:</span> {item.variant.color}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-bold text-xl text-gray-900">{formatPrice(finalPrice * item.quantity)}</p>
                    </div>

                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button
                            onClick={() => item.id && updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:shadow text-gray-600 hover:text-gray-900 transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => item.id && updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:shadow text-gray-600 hover:text-gray-900 transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => item.id && removeFromCart(item.id)}
                        className="group/delete flex items-center gap-2 text-gray-400 hover:text-red-500 font-medium transition-colors p-2 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={18} className="group-hover/delete:animate-bounce" />
                        <span className="hidden sm:inline">{t('cart.remove')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Link to="/shop" className="text-gray-900 font-bold hover:underline flex items-center gap-2">
              <ArrowLeft size={18} /> {t('cart.continueShopping')}
            </Link>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 text-sm font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              {t('cart.clearCart')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 sticky top-32">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">{t('cart.orderSummary')}</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('cart.shipping')}</span>
                <span className="text-green-600 font-bold">{cartTotal >= FREE_SHIPPING_THRESHOLD ? t('cart.free') : '$0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('cart.tax')}</span>
                <span className="font-medium">{formatPrice(cartTotal * 0.08)}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-6 flex justify-between items-end">
                <span className="text-gray-900 font-bold text-lg">{t('cart.total')}</span>
                <span className="text-4xl font-extrabold text-gray-900">{formatPrice(cartTotal * 1.08)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-gray-400" />
                {t('cart.secureCheckout')}
              </div>
              <Link
                to="/checkout"
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all transform hover:scale-[1.02] shadow-xl shadow-gray-900/20 text-lg"
              >
                {t('cart.checkout')} <ArrowRight size={20} />
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-sm">{t('cart.weAccept')}</p>
              <div className="flex justify-center gap-3 mt-3 opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;