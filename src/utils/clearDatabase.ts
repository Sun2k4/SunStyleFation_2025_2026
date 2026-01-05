import { supabase } from '../services/supabaseClient';

/**
 * Clear all seed data from database
 * WARNING: This will delete ALL data from products, categories, variants, cart_items, etc.
 */
export const clearDatabase = async () => {
    console.log('🗑️ Starting database cleanup...\n');

    try {
        // Delete in correct order (respect foreign key constraints)

        // 1. Delete cart items (references variants and products)
        console.log('Deleting cart items...');
        const { error: cartError } = await supabase
            .from('cart_items')
            .delete()
            .neq('id', 0);
        if (cartError) {
            console.error('❌ Failed to delete cart items:', cartError.message);
            throw new Error(`Cart items deletion failed: ${cartError.message}`);
        }

        // 2. Delete reviews (references products)
        console.log('Deleting reviews...');
        const { error: reviewsError } = await supabase
            .from('reviews')
            .delete()
            .neq('id', 0);
        if (reviewsError) {
            console.error('❌ Failed to delete reviews:', reviewsError.message);
            throw new Error(`Reviews deletion failed: ${reviewsError.message}`);
        }

        // 3. Delete order items FIRST (references products and variants)
        console.log('Deleting order items...');
        const { error: orderItemsError } = await supabase
            .from('order_items')
            .delete()
            .neq('id', 0);
        if (orderItemsError) {
            console.error('❌ Failed to delete order items:', orderItemsError.message);
            throw new Error(`Order items deletion failed: ${orderItemsError.message}`);
        }

        // 4. Delete orders (after order_items are gone)
        console.log('Deleting orders...');
        const { error: ordersError } = await supabase
            .from('orders')
            .delete()
            .neq('id', 0);
        if (ordersError) {
            console.error('❌ Failed to delete orders:', ordersError.message);
            throw new Error(`Orders deletion failed: ${ordersError.message}`);
        }

        // 5. Delete product variants (references products)
        console.log('Deleting product variants...');
        const { error: variantsError } = await supabase
            .from('product_variants')
            .delete()
            .neq('id', 0);
        if (variantsError) {
            console.error('❌ Failed to delete variants:', variantsError.message);
            throw new Error(`Variants deletion failed: ${variantsError.message}`);
        }

        // 6. Delete products (references categories) - NOW safe to delete
        console.log('Deleting products...');
        const { error: productsError } = await supabase
            .from('products')
            .delete()
            .neq('id', 0);
        if (productsError) {
            console.error('❌ Failed to delete products:', productsError.message);
            throw new Error(`Products deletion failed: ${productsError.message}`);
        }

        // 7. Delete categories (no dependencies left)
        console.log('Deleting categories...');
        const { error: categoriesError } = await supabase
            .from('categories')
            .delete()
            .neq('id', 0);
        if (categoriesError) {
            console.error('❌ Failed to delete categories:', categoriesError.message);
            throw new Error(`Categories deletion failed: ${categoriesError.message}`);
        }

        console.log('\n✅ Database cleanup completed!');
        console.log('All old seed data has been removed.\n');

        return { success: true };

    } catch (error: any) {
        console.error('❌ Error during cleanup:', error.message || error);
        console.error('⚠️  Database cleanup FAILED - some data may remain');
        return { success: false, error };
    }
};

/**
 * Clear database and reseed with fresh data
 */
export const refreshDatabase = async () => {
    console.log('🔄 Refreshing database...\n');

    // Import seedDatabase dynamically to avoid circular dependency
    const { seedDatabase } = await import('./seedData');

    // Step 1: Clear old data
    const clearResult = await clearDatabase();
    if (!clearResult.success) {
        throw new Error('Failed to clear database');
    }

    // Step 2: Seed new data
    console.log('📦 Seeding fresh data...\n');
    await seedDatabase();

    console.log('\n✅ Database refresh completed!');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
    (window as any).clearDatabase = clearDatabase;
    (window as any).refreshDatabase = refreshDatabase;
}
