import { describe, it, expect, beforeEach } from 'vitest';
import { mockSupabase, mockFromResponse } from '../tests/mocks/supabaseMock';
import { cartService } from './cartService';

describe('cartService', () => {
    const userId = 'user-123';
    const variantId = 101;

    beforeEach(() => {
        mockSupabase.from.mockClear();
    });

    // ─── Test 4: addToCart inserts new item ───
    it('should add a new item to the cart', async () => {
        // First call: check if item exists → not found (maybeSingle returns null)
        const selectBuilder = mockFromResponse(null);
        selectBuilder.maybeSingle = () => Promise.resolve({ data: null, error: null });

        // Override from for the insert call
        let callCount = 0;
        mockSupabase.from.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return selectBuilder;
            }
            return mockFromResponse(null);
        });

        await cartService.addToCart(userId, variantId, 1);

        expect(mockSupabase.from).toHaveBeenCalledWith('cart_items');
    });

    // ─── Test 5: getCartItems returns items with product data ───
    it('should fetch cart items with product details', async () => {
        const mockCartItems = [
            {
                id: 1,
                user_id: userId,
                variant_id: variantId,
                quantity: 2,
                product_variants: {
                    id: variantId,
                    size: 'M',
                    color: 'Red',
                    products: {
                        id: 'prod-1',
                        name: 'Summer Dress',
                        price: 59.99,
                        image_url: 'https://example.com/dress.jpg',
                        stock_quantity: 10,
                        categories: { name: 'Dresses' },
                    },
                },
            },
        ];

        mockFromResponse(mockCartItems);

        const items = await cartService.getCartItems(userId);

        expect(mockSupabase.from).toHaveBeenCalledWith('cart_items');
        expect(items).toHaveLength(1);
        expect(items[0].quantity).toBe(2);
        expect(items[0].product?.name).toBe('Summer Dress');
        expect(items[0].product?.image).toBe('https://example.com/dress.jpg');
    });

    // ─── Test 6: removeItem deletes item ───
    it('should remove an item from the cart', async () => {
        mockFromResponse(null);

        await cartService.removeItem(1);

        expect(mockSupabase.from).toHaveBeenCalledWith('cart_items');
    });
});
