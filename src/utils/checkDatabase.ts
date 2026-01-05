import { supabase } from '../services/supabaseClient';

/**
 * Check current database state
 * Run this in browser console or create an admin endpoint
 */
export const checkDatabaseState = async () => {
    console.log('🔍 Checking database state...\n');

    try {
        // Check categories
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*');

        if (catError) throw catError;
        console.log(`📁 Categories: ${categories?.length || 0}`);
        if (categories && categories.length > 0) {
            categories.forEach(cat => console.log(`   - ${cat.name} (ID: ${cat.id})`));
        }

        // Check products
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('id, name, category_id, price');

        if (prodError) throw prodError;
        console.log(`\n📦 Products: ${products?.length || 0}`);
        if (products && products.length > 0) {
            products.slice(0, 5).forEach(p =>
                console.log(`   - ${p.name} (ID: ${p.id}, Category ID: ${p.category_id}, Price: $${p.price})`)
            );
            if (products.length > 5) {
                console.log(`   ... and ${products.length - 5} more`);
            }
        }

        // Check product variants
        const { data: variants, error: varError } = await supabase
            .from('product_variants')
            .select('id, product_id, size, color, stock_quantity');

        if (varError) throw varError;
        console.log(`\n🎨 Product Variants: ${variants?.length || 0}`);
        if (variants && variants.length > 0) {
            const sampleVariants = variants.slice(0, 3);
            sampleVariants.forEach(v =>
                console.log(`   - Product ${v.product_id}: ${v.size} / ${v.color} (Stock: ${v.stock_quantity})`)
            );
            if (variants.length > 3) {
                console.log(`   ... and ${variants.length - 3} more`);
            }
        }

        // Check reviews
        const { data: reviews, error: revError } = await supabase
            .from('reviews')
            .select('id, product_id, rating');

        if (revError) throw revError;
        console.log(`\n⭐ Reviews: ${reviews?.length || 0}`);

        // Check cart items
        const { data: cartItems, error: cartError } = await supabase
            .from('cart_items')
            .select('id, user_id, variant_id');

        if (cartError) throw cartError;
        console.log(`\n🛒 Cart Items: ${cartItems?.length || 0}`);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 SUMMARY:');
        console.log('='.repeat(50));

        const hasData = (categories?.length || 0) > 0 && (products?.length || 0) > 0;

        if (hasData) {
            console.log('✅ Database has seed data');
            console.log(`   - ${categories?.length} categories`);
            console.log(`   - ${products?.length} products`);
            console.log(`   - ${variants?.length} variants`);

            // Check if products have category_id
            const productsWithCategoryId = products?.filter(p => p.category_id !== null).length || 0;
            if (productsWithCategoryId === products?.length) {
                console.log('✅ All products have category_id (schema updated)');
            } else {
                console.log(`⚠️  Only ${productsWithCategoryId}/${products?.length} products have category_id`);
                console.log('   Run migration or re-seed to fix this');
            }

            // Check if variants exist
            if ((variants?.length || 0) > 0) {
                console.log('✅ Product variants exist');
            } else {
                console.log('⚠️  No product variants found');
                console.log('   Run seedDatabase() to create variants');
            }
        } else {
            console.log('❌ Database is empty or missing data');
            console.log('\n💡 To seed the database:');
            console.log('   1. Go to Admin → Categories page');
            console.log('   2. Click "Seed Database" button');
            console.log('   OR run: await seedDatabase() in console');
        }

        return {
            categories: categories?.length || 0,
            products: products?.length || 0,
            variants: variants?.length || 0,
            reviews: reviews?.length || 0,
            cartItems: cartItems?.length || 0,
            hasData,
        };

    } catch (error) {
        console.error('❌ Error checking database:', error);
        return null;
    }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
    (window as any).checkDatabaseState = checkDatabaseState;
}
