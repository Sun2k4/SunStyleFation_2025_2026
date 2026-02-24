/**
 * Mock for @supabase/supabase-js
 * Provides chainable query builder pattern matching Supabase client API.
 */
import { vi } from 'vitest';

// Chainable mock builder
const createMockQueryBuilder = (resolvedData: any = null, resolvedError: any = null) => {
    const result = { data: resolvedData, error: resolvedError };

    const builder: any = {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue(result),
        maybeSingle: vi.fn().mockResolvedValue(result),
        then: vi.fn((resolve: any) => resolve(result)),
        // Make it thenable so await works
        [Symbol.toStringTag]: 'Promise',
    };

    // When builder is awaited directly, resolve the result
    builder.then = (onfulfilled: any) => Promise.resolve(result).then(onfulfilled);

    return builder;
};

// Mock Supabase client
export const mockSupabase = {
    from: vi.fn(() => createMockQueryBuilder()),
    auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
    },
    storage: {
        from: vi.fn(() => ({
            upload: vi.fn().mockResolvedValue({ data: { path: 'test-path.jpg' }, error: null }),
            getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.jpg' } }),
        })),
    },
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    functions: {
        invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
};

/**
 * Helper to configure mockSupabase.from() to return specific data for tests.
 */
export const mockFromResponse = (data: any, error: any = null) => {
    const builder = createMockQueryBuilder(data, error);
    mockSupabase.from.mockReturnValue(builder);
    return builder;
};

// Mock the module
vi.mock('../../services/supabaseClient', () => ({
    supabase: mockSupabase,
}));

export { createMockQueryBuilder };
