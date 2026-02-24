import { describe, it, expect, beforeEach } from 'vitest';
import { mockSupabase, mockFromResponse } from '../tests/mocks/supabaseMock';
import { categoryService } from './categoryService';

describe('categoryService', () => {
    beforeEach(() => {
        mockSupabase.from.mockClear();
    });

    // ─── Test 7: getAllCategories returns categories ───
    it('should fetch all categories', async () => {
        const mockCategories = [
            { id: 1, name: 'Dresses', slug: 'dresses', description: '', created_at: '2026-01-01' },
            { id: 2, name: 'Tops', slug: 'tops', description: '', created_at: '2026-01-01' },
            { id: 3, name: 'Accessories', slug: 'accessories', description: '', created_at: '2026-01-01' },
        ];

        // First call returns categories, second call returns products for counting
        let callCount = 0;
        mockSupabase.from.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return mockFromResponse(mockCategories);
            }
            return mockFromResponse([{ category_id: 1 }, { category_id: 1 }, { category_id: 2 }]);
        });

        const categories = await categoryService.getAllCategories();

        expect(categories).toHaveLength(3);
        expect(categories[0].name).toBe('Dresses');
        expect(categories[1].name).toBe('Tops');
        expect(categories[2].name).toBe('Accessories');
        // productCount is computed from a second query
        categories.forEach(c => expect(typeof c.productCount).toBe('number'));
    });

    // ─── Test 8: getAllCategories handles empty result ───
    it('should return empty array when no categories exist', async () => {
        mockFromResponse([]);

        const categories = await categoryService.getAllCategories();

        expect(categories).toEqual([]);
    });
});
