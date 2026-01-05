import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Package, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { Product } from '../../types';

interface Variant {
    id: number;
    product_id: number;
    size: string;
    color: string;
    stock_quantity: number;
    sku: string;
    price_adjustment: number;
}

interface VariantModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: () => void;
}

const VariantModal: React.FC<VariantModalProps> = ({ product, isOpen, onClose, onUpdate }) => {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && product) {
            fetchVariants();
        }
    }, [isOpen, product]);

    const fetchVariants = async () => {
        if (!product) return;
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('product_variants')
                .select('*')
                .eq('product_id', product.id)
                .order('size')
                .order('color');

            if (error) throw error;
            setVariants(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load variants');
        } finally {
            setLoading(false);
        }
    };

    const updateStock = async (variantId: number, newStock: number) => {
        setSaving(variantId);
        try {
            const { error } = await supabase
                .from('product_variants')
                .update({ stock_quantity: newStock })
                .eq('id', variantId);

            if (error) throw error;

            // Update local state
            setVariants(prev =>
                prev.map(v => (v.id === variantId ? { ...v, stock_quantity: newStock } : v))
            );

            if (onUpdate) onUpdate();
        } catch (err: any) {
            setError(err.message || 'Failed to update stock');
        } finally {
            setSaving(null);
        }
    };

    if (!isOpen) return null;

    // Group variants by size for better display
    const groupedBySize = variants.reduce((acc, variant) => {
        if (!acc[variant.size]) acc[variant.size] = [];
        acc[variant.size].push(variant);
        return acc;
    }, {} as Record<string, Variant[]>);

    const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">Manage Variants</h2>
                            <p className="text-purple-100 mt-1">{product?.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-white/10 rounded-xl p-3">
                            <div className="text-2xl font-bold">{variants.length}</div>
                            <div className="text-xs text-purple-200">Total Variants</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3">
                            <div className="text-2xl font-bold">{totalStock}</div>
                            <div className="text-xs text-purple-200">Total Stock</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3">
                            <div className="text-2xl font-bold">{Object.keys(groupedBySize).length}</div>
                            <div className="text-xs text-purple-200">Sizes Available</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        </div>
                    ) : variants.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No variants found for this product</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Use "Add Variants" in Database Utility to create them
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {(Object.entries(groupedBySize) as [string, Variant[]][]).map(([size, sizeVariants]) => (
                                <div key={size}>
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="bg-gray-100 px-3 py-1 rounded-lg">Size {size}</span>
                                        <span className="text-sm text-gray-400 font-normal">
                                            ({sizeVariants.reduce((sum: number, v: Variant) => sum + v.stock_quantity, 0)} units)
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {sizeVariants.map((variant: Variant) => (
                                            <div
                                                key={variant.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-6 h-6 rounded-full border-2 border-gray-200"
                                                        style={{
                                                            backgroundColor:
                                                                variant.color.toLowerCase() === 'white' ? '#fff' :
                                                                    variant.color.toLowerCase() === 'black' ? '#000' :
                                                                        variant.color.toLowerCase() === 'blue' ? '#3b82f6' :
                                                                            variant.color.toLowerCase() === 'gray' ? '#6b7280' :
                                                                                variant.color.toLowerCase() === 'red' ? '#ef4444' :
                                                                                    '#9ca3af'
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900">{variant.color}</div>
                                                        <div className="text-xs text-gray-400">SKU: {variant.sku}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variant.stock_quantity}
                                                        onChange={(e) => {
                                                            const newValue = parseInt(e.target.value) || 0;
                                                            setVariants(prev =>
                                                                prev.map(v => (v.id === variant.id ? { ...v, stock_quantity: newValue } : v))
                                                            );
                                                        }}
                                                        onBlur={(e) => {
                                                            const newValue = parseInt(e.target.value) || 0;
                                                            updateStock(variant.id, newValue);
                                                        }}
                                                        className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    />
                                                    {saving === variant.id && (
                                                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VariantModal;
