import { supabase } from '../services/supabaseClient';

/**
 * Diagnose database issues - check for duplicate or orphaned products
 */
export const diagnoseDatabaseIssues = async () => {
    console.log('🔍 Diagnosing database issues...\n');

    try {
        // 1. Check total products
        const { data: allProducts, error: prodError } = await supabase
            .from('products')
            .select('id, name, category_id');

        if (prodError) throw prodError;

        console.log(`📦 Total products in database: ${allProducts?.length || 0}`);

        // 2. Check products without category_id (orphaned)
        const orphanedProducts = allProducts?.filter(p => !p.category_id) || [];
        console.log(`⚠️  Products without category_id: ${orphanedProducts.length}`);
        if (orphanedProducts.length > 0) {
            console.log('   These products will NOT show in category filters:');
            orphanedProducts.slice(0, 5).forEach(p =>
                console.log(`   - ${p.name} (ID: ${p.id})`)
            );
            if (orphanedProducts.length > 5) {
                console.log(`   ... and ${orphanedProducts.length - 5} more`);
            }
        }

        // 3. Check for duplicate product names
        const nameCount: Record<string, number> = {};
        allProducts?.forEach(p => {
            nameCount[p.name] = (nameCount[p.name] || 0) + 1;
        });
        const duplicates = Object.entries(nameCount).filter(([_, count]) => count > 1);

        if (duplicates.length > 0) {
            console.log(`\n🔄 Duplicate product names found: ${duplicates.length}`);
            duplicates.slice(0, 5).forEach(([name, count]) =>
                console.log(`   - "${name}" appears ${count} times`)
            );
        }

        // 4. Check categories
        const { data: categories } = await supabase
            .from('categories')
            .select('id, name');

        console.log(`\n📁 Total categories: ${categories?.length || 0}`);
        categories?.forEach(cat => {
            const count = allProducts?.filter(p => p.category_id === cat.id).length || 0;
            console.log(`   - ${cat.name}: ${count} products`);
        });

        // 5. Recommendations
        console.log('\n💡 RECOMMENDATIONS:');
        if (orphanedProducts.length > 0) {
            console.log('   ⚠️  Delete orphaned products (no category_id)');
            console.log('      Run: await cleanupOrphanedProducts()');
        }
        if (duplicates.length > 0) {
            console.log('   ⚠️  You have duplicate products from multiple seed runs');
            console.log('      Run: await refreshDatabase() to clean and reseed');
        }
        if (orphanedProducts.length === 0 && duplicates.length === 0) {
            console.log('   ✅ Database looks healthy!');
        }

        return {
            totalProducts: allProducts?.length || 0,
            orphanedProducts: orphanedProducts.length,
            duplicates: duplicates.length,
            categories: categories?.length || 0,
        };

    } catch (error) {
        console.error('❌ Error diagnosing database:', error);
        return null;
    }
};

/**
 * Clean up orphaned products (products without category_id)
 */
export const cleanupOrphanedProducts = async () => {
    console.log('🧹 Cleaning up orphaned products safely...\n');

    try {
        // 1. Get orphaned products
        const { data: orphaned, error: findError } = await supabase
            .from('products')
            .select('id, name')
            .is('category_id', null);

        if (findError) throw findError;

        if (!orphaned || orphaned.length === 0) {
            console.log('✅ No orphaned products found!');
            return { deleted: 0, skipped: 0 };
        }

        console.log(`Found ${orphaned.length} orphaned products. Trying to delete...`);

        let deletedCount = 0;
        let skippedCount = 0;

        // 2. Try to delete orphaned variants first (should be safe usually)
        const orphanedIds = orphaned.map(p => p.id);
        await supabase
            .from('product_variants')
            .delete()
            .in('product_id', orphanedIds);

        // 3. Delete products one by one to handle FK constraints individually
        for (const product of orphaned) {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', product.id);

            if (error) {
                // Typically FK constraint error
                skippedCount++;
                console.log(`⚠️ Skipped "${product.name}" (ID: ${product.id}) - likely has orders`);
            } else {
                deletedCount++;
            }
        }

        console.log(`\n✅ Cleanup finished:`);
        console.log(`   - Deleted: ${deletedCount}`);
        console.log(`   - Skipped: ${skippedCount} (preserved due to existing orders)`);

        return { deleted: deletedCount, skipped: skippedCount };

    } catch (error) {
        console.error('❌ Error cleaning up:', error);
        throw error;
    }
};

// Export for browser console
if (typeof window !== 'undefined') {
    (window as any).diagnoseDatabaseIssues = diagnoseDatabaseIssues;
    (window as any).cleanupOrphanedProducts = cleanupOrphanedProducts;
}
