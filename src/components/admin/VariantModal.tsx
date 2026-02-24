import React, { useState, useEffect } from 'react';
import { X, Loader2, Package, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { Product } from '../../types';
import { message } from 'antd';

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

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Gray', 'Green', 'Navy', 'Beige', 'Pink'];

const VariantModal: React.FC<VariantModalProps> = ({ product, isOpen, onClose, onUpdate }) => {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Add new variant form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVariant, setNewVariant] = useState({ size: 'M', color: 'Black', stock_quantity: 10, price_adjustment: 0 });
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            fetchVariants();
            setShowAddForm(false);
            setError(null);
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
            setVariants(prev =>
                prev.map(v => (v.id === variantId ? { ...v, stock_quantity: newStock } : v))
            );
            message.success('Cập nhật tồn kho thành công');
            if (onUpdate) onUpdate();
        } catch (err: any) {
            setError(err.message || 'Failed to update stock');
        } finally {
            setSaving(null);
        }
    };

    const addVariant = async () => {
        if (!product) return;

        // Check duplicate
        const existing = variants.find(v => v.size === newVariant.size && v.color === newVariant.color);
        if (existing) {
            message.warning(`Variant ${newVariant.size}/${newVariant.color} đã tồn tại`);
            return;
        }

        setAdding(true);
        try {
            const sku = `${product.name.substring(0, 3).toUpperCase()}-${newVariant.size}-${newVariant.color.substring(0, 3).toUpperCase()}-${Date.now().toString(36).slice(-4)}`;

            const { data, error } = await supabase
                .from('product_variants')
                .insert({
                    product_id: product.id,
                    size: newVariant.size,
                    color: newVariant.color,
                    stock_quantity: newVariant.stock_quantity,
                    price_adjustment: newVariant.price_adjustment,
                    sku: sku,
                })
                .select()
                .single();

            if (error) throw error;
            setVariants(prev => [...prev, data]);
            setShowAddForm(false);
            setNewVariant({ size: 'M', color: 'Black', stock_quantity: 10, price_adjustment: 0 });
            message.success(`Đã thêm variant ${newVariant.size}/${newVariant.color}`);
            if (onUpdate) onUpdate();
        } catch (err: any) {
            setError(err.message || 'Failed to add variant');
        } finally {
            setAdding(false);
        }
    };

    const deleteVariant = async (variantId: number) => {
        try {
            const { error } = await supabase
                .from('product_variants')
                .delete()
                .eq('id', variantId);

            if (error) throw error;
            setVariants(prev => prev.filter(v => v.id !== variantId));
            message.success('Đã xóa variant');
            if (onUpdate) onUpdate();
        } catch (err: any) {
            setError(err.message || 'Failed to delete variant');
        }
    };

    if (!isOpen) return null;

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
                            <h2 className="text-xl font-bold">Quản lý Variants</h2>
                            <p className="text-purple-100 mt-1">{product?.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
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
                            <div className="text-xs text-purple-200">Sizes</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[55vh]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        </div>
                    ) : variants.length === 0 && !showAddForm ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Chưa có variant nào</p>
                            <p className="text-sm text-gray-400 mt-1">Nhấn "Thêm Variant" để tạo size/màu cho sản phẩm</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(Object.entries(groupedBySize) as [string, Variant[]][]).map(([size, sizeVariants]) => (
                                <div key={size}>
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">Size {size}</span>
                                        <span className="text-xs text-gray-400 font-normal">
                                            ({sizeVariants.reduce((sum: number, v: Variant) => sum + v.stock_quantity, 0)} sản phẩm)
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {sizeVariants.map((variant: Variant) => (
                                            <div
                                                key={variant.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-6 h-6 rounded-full border-2 border-gray-200 flex-shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                variant.color.toLowerCase() === 'white' ? '#fff' :
                                                                    variant.color.toLowerCase() === 'black' ? '#000' :
                                                                        variant.color.toLowerCase() === 'blue' ? '#3b82f6' :
                                                                            variant.color.toLowerCase() === 'gray' ? '#6b7280' :
                                                                                variant.color.toLowerCase() === 'red' ? '#ef4444' :
                                                                                    variant.color.toLowerCase() === 'green' ? '#22c55e' :
                                                                                        variant.color.toLowerCase() === 'navy' ? '#1e3a5f' :
                                                                                            variant.color.toLowerCase() === 'beige' ? '#f5f5dc' :
                                                                                                variant.color.toLowerCase() === 'pink' ? '#ec4899' :
                                                                                                    '#9ca3af'
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-sm">{variant.color}</div>
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
                                                        className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    />
                                                    {saving === variant.id && (
                                                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                                                    )}
                                                    <button
                                                        onClick={() => deleteVariant(variant.id)}
                                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Xóa variant"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Variant Form */}
                    {showAddForm && (
                        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                            <h4 className="font-bold text-purple-900 mb-3">Thêm Variant Mới</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                                    <select
                                        value={newVariant.size}
                                        onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                                    >
                                        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Màu</label>
                                    <select
                                        value={newVariant.color}
                                        onChange={(e) => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                                    >
                                        {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Số lượng tồn kho</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newVariant.stock_quantity}
                                        onChange={(e) => setNewVariant(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Điều chỉnh giá (₫)</label>
                                    <input
                                        type="number"
                                        value={newVariant.price_adjustment}
                                        onChange={(e) => setNewVariant(prev => ({ ...prev, price_adjustment: parseInt(e.target.value) || 0 }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={addVariant}
                                    disabled={adding}
                                    className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                    Thêm
                                </button>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Hủy
                                </button>
                            </div>
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
                <div className="border-t border-gray-100 p-4 flex justify-between">
                    <button
                        onClick={() => setShowAddForm(true)}
                        disabled={showAddForm}
                        className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Thêm Variant
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VariantModal;
