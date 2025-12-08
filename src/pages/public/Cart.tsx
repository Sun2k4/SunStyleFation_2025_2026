import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" 
          alt="Empty Cart" 
          className="w-48 h-48 opacity-50 mb-6 grayscale"
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="bg-primary-500 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-600 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        <Link to={`/products/${item.id}`}>{item.name}</Link>
                      </h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <p className="font-bold text-lg text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium text-gray-900 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Trash2 size={18} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={clearCart}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;