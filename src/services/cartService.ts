import { supabase } from './supabaseClient';
import { CartItem } from '../types';

export const cartService = {
    /**
     * Add item to cart or update quantity if already exists
     * CRITICAL: Uses variant_id to track size/color selection
     */
    addToCart: async (userId: string, variantId: number, quantity: number = 1): Promise<void> => {
        // Check if item already exists in cart
        const { data: existing } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .eq('variant_id', variantId)
            .maybeSingle();

        if (existing) {
            // Update quantity if item already in cart
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + quantity })
                .eq('id', existing.id);

            if (error) {
                console.error('Error updating cart item:', error);
                throw error;
            }
        } else {
            // Insert new cart item
            const { error } = await supabase
                .from('cart_items')
                .insert({
                    user_id: userId,
                    variant_id: variantId,
                    quantity
                });

            if (error) {
                console.error('Error adding to cart:', error);
                throw error;
            }
        }
    },

    /**
     * Get all cart items for a user with nested product and variant data
     */
    getCartItems: async (userId: string): Promise<CartItem[]> => {
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
        *,
        product_variants(
          *,
          products(
            *,
            categories(name)
          )
        )
      `)
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching cart items:', error);
            return [];
        }

        // Transform data to match CartItem interface
        return (data || []).map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            variant: item.product_variants,
            product: item.product_variants?.products ? {
                ...item.product_variants.products,
                image: item.product_variants.products.image_url,
                stock: item.product_variants.products.stock_quantity,
                categoryName: item.product_variants.products.categories?.name,
            } : undefined,
        }));
    },

    /**
     * Update quantity of a cart item
     */
    updateQuantity: async (cartItemId: number, quantity: number): Promise<void> => {
        if (quantity < 1) {
            throw new Error('Quantity must be at least 1');
        }

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', cartItemId);

        if (error) {
            console.error('Error updating quantity:', error);
            throw error;
        }
    },

    /**
     * Remove item from cart
     */
    removeItem: async (cartItemId: number): Promise<void> => {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItemId);

        if (error) {
            console.error('Error removing cart item:', error);
            throw error;
        }
    },

    /**
     * Clear all cart items for a user
     */
    clearCart: async (userId: string): Promise<void> => {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    },
};
