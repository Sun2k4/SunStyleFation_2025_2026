import { describe, it, expect, beforeEach } from 'vitest';
import { mockSupabase, mockFromResponse } from '../tests/mocks/supabaseMock';
import { productService } from './productService';

describe('productService', () => {
    beforeEach(() => {
        mockSupabase.from.mockClear();
    });

    // ─── Test 1: getAllProducts returns mapped products ───
    it('should fetch and map all products correctly', async () => {
        const mockDbRows = [
            {
                id: '1',
                name: 'Summer Dress',
                price: 59.99,
                image_url: 'https://example.com/dress.jpg',
                stock_quantity: 10,
                slug: 'summer-dress',
                categories: { name: 'Dresses' },
                product_variants: [],
                reviews_list: [],
            },
            {
                id: '2',
                name: 'Classic Shirt',
                price: 39.99,
                image_url: null,
                stock_quantity: 0,
                slug: null,
                categories: { name: 'Tops' },
                product_variants: [],
                reviews_list: [],
            },
        ];

        mockFromResponse(mockDbRows);

        const products = await productService.getAllProducts();

        expect(mockSupabase.from).toHaveBeenCalledWith('products');
        expect(products).toHaveLength(2);

        // Check field mapping
        expect(products[0].image).toBe('https://example.com/dress.jpg');
        expect(products[0].stock).toBe(10);
        expect(products[0].categoryName).toBe('Dresses');

        // Check fallback values
        expect(products[1].image).toBe('');
        expect(products[1].stock).toBe(0);
        expect(products[1].slug).toBe('classic-shirt'); // auto-generated
    });

    // ─── Test 2: getAllProducts handles Supabase error gracefully ───
    it('should return empty array when Supabase query fails', async () => {
        mockFromResponse(null, { message: 'Network error' });

        const products = await productService.getAllProducts();

        expect(products).toEqual([]);
    });

    // ─── Test 3: getProductById returns single product ───
    it('should fetch a single product by ID', async () => {
        const mockProduct = {
            id: '1',
            name: 'Summer Dress',
            price: 59.99,
            image_url: 'https://example.com/dress.jpg',
            stock_quantity: 10,
            slug: 'summer-dress',
            categories: { name: 'Dresses' },
            product_variants: [{ id: 'v1', size: 'M', color: 'Red', stock: 5 }],
            reviews_list: [],
        };

        const builder = mockFromResponse(mockProduct);
        builder.single = () => Promise.resolve({ data: mockProduct, error: null });

        const product = await productService.getProductById(1);

        expect(mockSupabase.from).toHaveBeenCalledWith('products');
        expect(product).toBeDefined();
        expect(product!.name).toBe('Summer Dress');
        expect(product!.variants).toEqual([{ id: 'v1', size: 'M', color: 'Red', stock: 5 }]);
    });
});
