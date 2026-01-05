import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (variantId: number, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user) return;
    try {
      const items = await cartService.getCartItems(user.id);
      setCart(items);
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  const addToCart = async (variantId: number, quantity: number = 1) => {
    if (!user) {
      // TODO: Handle guest cart with localStorage
      alert('Please login to add items to cart');
      return;
    }

    try {
      await cartService.addToCart(user.id, variantId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await cartService.removeItem(cartItemId);
      await refreshCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await cartService.updateQuantity(cartItemId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await cartService.clearCart(user.id);
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const adjustment = item.variant?.price_adjustment || 0;
    return sum + ((price + adjustment) * item.quantity);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};