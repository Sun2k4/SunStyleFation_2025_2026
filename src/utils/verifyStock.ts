import { supabase } from '../services/supabaseClient';

export const verifyStockDeduction = async () => {
    console.log('🧪 Testing Stock Deduction Logic...\n');

    try {
        // 1. Get a test product variant
        const { data: variants } = await supabase
            .from('product_variants')
            .select('*')
            .limit(1);

        if (!variants || variants.length === 0) {
            console.error('❌ No variants found. Please add variants first!');
            return;
        }

        const testVariant = variants[0];
        console.log(`Initial Stock for Variant ID ${testVariant.id} (${testVariant.size}/${testVariant.color}): ${testVariant.stock_quantity}`);

        // 2. Try to decrement stock via RPC
        console.log('Try to decrement 1 unit...');
        const { error } = await supabase.rpc('decrement_stock', {
            p_variant_id: testVariant.id,
            p_quantity: 1
        });

        if (error) {
            console.error('❌ RPC Failed:', error.message);
            console.log('💡 TIP: Did you run the SQL script in Supabase?');
        } else {
            console.log('✅ RPC Success!');

            // 3. Verify new stock
            const { data: updated } = await supabase
                .from('product_variants')
                .select('stock_quantity')
                .eq('id', testVariant.id)
                .single();

            console.log(`New Stock: ${updated?.stock_quantity}`);
            console.log(updated?.stock_quantity === testVariant.stock_quantity - 1 ? '✅ Stock deducted correctly!' : '❌ Stock mismatch!');
        }

    } catch (e) {
        console.error('Test Error:', e);
    }
};

// Export to window for easy access
if (typeof window !== 'undefined') {
    (window as any).verifyStock = verifyStockDeduction;
}
