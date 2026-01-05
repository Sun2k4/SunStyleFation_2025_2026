import { supabase } from '../services/supabaseClient';

/**
 * Add variants to all products that don't have variants yet
 * This keeps existing products but ensures they have size/color options
 */
export const addVariantsToProducts = async () => {
    console.log('🎨 Adding variants to existing products...\n');

    try {
        // 1. Get all products
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('id, name')
            .not('category_id', 'is', null); // Only products with valid category

        if (prodError) throw prodError;

        if (!products || products.length === 0) {
            console.log('⚠️ No products found in database');
            return { added: 0, skipped: 0 };
        }

        console.log(`Found ${products.length} products. Checking variants...`);

        const sizes = ['S', 'M', 'L', 'XL'];
        const colors = ['Black', 'White', 'Blue', 'Gray'];
        let addedCount = 0;
        let skippedCount = 0;

        for (const product of products) {
            // Check if product already has variants
            const { data: existingVariants } = await supabase
                .from('product_variants')
                .select('id')
                .eq('product_id', product.id)
                .limit(1);

            if (existingVariants && existingVariants.length > 0) {
                console.log(`⏭️ Skipping "${product.name}" - already has variants`);
                skippedCount++;
                continue;
            }

            // Create variants for this product
            console.log(`➕ Adding variants for "${product.name}"...`);

            for (const size of sizes) {
                for (const color of colors) {
                    const { error } = await supabase.from('product_variants').insert({
                        product_id: product.id,
                        size,
                        color,
                        stock_quantity: Math.floor(Math.random() * 30) + 10,
                        sku: `${product.id}-${size}-${color}`.toUpperCase(),
                        price_adjustment: 0,
                    });

                    if (error) {
                        console.error(`   Error creating ${size}/${color}:`, error.message);
                    }
                }
            }
            addedCount++;
        }

        console.log(`\n✅ Variants added!`);
        console.log(`   - Products with new variants: ${addedCount}`);
        console.log(`   - Products skipped (already had variants): ${skippedCount}`);
        console.log(`   - Total variants per product: ${sizes.length * colors.length} (${sizes.join(', ')} × ${colors.join(', ')})`);

        return { added: addedCount, skipped: skippedCount };

    } catch (error) {
        console.error('❌ Error adding variants:', error);
        throw error;
    }
};

// Export for browser console
if (typeof window !== 'undefined') {
    (window as any).addVariantsToProducts = addVariantsToProducts;
}
