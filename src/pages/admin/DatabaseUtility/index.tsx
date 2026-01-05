import React, { useState } from 'react';
import { Database, RefreshCw, Package, ShoppingCart, CheckCircle, XCircle, Loader2, Trash2, AlertTriangle, Palette } from 'lucide-react';
import { seedDatabase } from '../../../utils/seedData';
import { checkDatabaseState } from '../../../utils/checkDatabase';
import { clearDatabase, refreshDatabase } from '../../../utils/clearDatabase';
import { diagnoseDatabaseIssues, cleanupOrphanedProducts } from '../../../utils/diagnoseDatabase';
import { addVariantsToProducts } from '../../../utils/addVariants';
import { verifyStockDeduction } from '../../../utils/verifyStock';

const DatabaseUtility: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [diagnosing, setDiagnosing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [dbState, setDbState] = useState<any>(null);

    const handleDiagnose = async () => {
        setDiagnosing(true);
        setResult(null);
        try {
            const issues = await diagnoseDatabaseIssues();
            if (issues && (issues.orphanedProducts > 0 || issues.duplicates > 0)) {
                setResult({
                    success: false,
                    message: `Found ${issues.orphanedProducts} orphaned products and ${issues.duplicates} duplicates. Check console for details.`
                });
            } else {
                setResult({ success: true, message: 'Database looks healthy!' });
            }
            setTimeout(() => handleCheckDatabase(), 1000);
        } catch (error: any) {
            setResult({ success: false, message: error.message || 'Failed to diagnose' });
        } finally {
            setDiagnosing(false);
        }
    };

    const handleCleanupOrphaned = async () => {
        if (!confirm('This will delete all products without category_id. Continue?')) {
            return;
        }
        try {
            const result = await cleanupOrphanedProducts();
            setResult({ success: true, message: `Cleaned up ${result.deleted} orphaned products` });
            setTimeout(() => handleCheckDatabase(), 1000);
        } catch (error: any) {
            setResult({ success: false, message: error.message || 'Cleanup failed' });
        }
    };

    const [addingVariants, setAddingVariants] = useState(false);

    const handleAddVariants = async () => {
        setAddingVariants(true);
        setResult(null);
        try {
            const results = await addVariantsToProducts();
            setResult({
                success: true,
                message: `Added variants to ${results.added} products! (${results.skipped} already had variants)`
            });
            setTimeout(() => handleCheckDatabase(), 1000);
        } catch (error: any) {
            setResult({ success: false, message: error.message || 'Failed to add variants' });
        } finally {
            setAddingVariants(false);
        }
    };

    const handleSeedDatabase = async () => {
        setLoading(true);
        setResult(null);
        try {
            await seedDatabase();
            setResult({ success: true, message: 'Database seeded successfully!' });
            setTimeout(() => handleCheckDatabase(), 1000);
        } catch (error: any) {
            setResult({ success: false, message: error.message || 'Failed to seed database' });
        } finally {
            setLoading(false);
        }
    };

    const handleClearDatabase = async () => {
        if (!confirm('⚠️ WARNING: This will delete ALL data from the database. Are you sure?')) {
            return;
        }

        setClearing(true);
        setResult(null);
        try {
            await clearDatabase();
            setResult({ success: true, message: 'Database cleared successfully!' });
            setTimeout(() => handleCheckDatabase(), 1000);
        } catch (error: any) {
            setResult({ success: false, message: error.message || 'Failed to clear database' });
        } finally {
            setClearing(false);
        }
    };

    const handleRefreshDatabase = async () => {
        if (!confirm('This will delete all old data and create fresh seed data. Continue?')) {
            return;
        }

        setRefreshing(true);
        setResult(null);
        try {
            await refreshDatabase();
            setResult({ success: true, message: 'Database refreshed successfully!' });
            setTimeout(() => handleCheckDatabase(), 1000);
        } catch (error: any) {
            setResult({ success: false, message: error.message || 'Failed to refresh database' });
        } finally {
            setRefreshing(false);
        }
    };

    const handleCheckDatabase = async () => {
        setChecking(true);
        try {
            const state = await checkDatabaseState();
            setDbState(state);
        } catch (error) {
            console.error('Error checking database:', error);
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Database Utilities</h1>
                <p className="text-gray-500">Seed and manage your database</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={handleSeedDatabase}
                    disabled={loading}
                    className="bg-primary-500 text-white p-6 rounded-2xl hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-3 mb-2">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Database className="w-6 h-6" />}
                        <h3 className="text-lg font-bold">Seed Database</h3>
                    </div>
                    <p className="text-sm text-white/80">Add sample categories, products, and variants</p>
                </button>

                <button
                    onClick={handleCheckDatabase}
                    disabled={checking}
                    className="bg-gray-900 text-white p-6 rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-3 mb-2">
                        {checking ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
                        <h3 className="text-lg font-bold">Check Database</h3>
                    </div>
                    <p className="text-sm text-white/80">View current database state and statistics</p>
                </button>

                <button
                    onClick={handleClearDatabase}
                    disabled={clearing}
                    className="bg-red-500 text-white p-6 rounded-2xl hover:bg-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-3 mb-2">
                        {clearing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Trash2 className="w-6 h-6" />}
                        <h3 className="text-lg font-bold">Clear Database</h3>
                    </div>
                    <p className="text-sm text-white/80">Delete ALL data from database (⚠️ Dangerous!)</p>
                </button>

                <button
                    onClick={handleRefreshDatabase}
                    disabled={refreshing}
                    className="bg-blue-500 text-white p-6 rounded-2xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-3 mb-2">
                        {refreshing ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
                        <h3 className="text-lg font-bold">Refresh Database</h3>
                    </div>
                    <p className="text-sm text-white/80">Clear old data and reseed with fresh data</p>
                </button>

                <button
                    onClick={handleDiagnose}
                    disabled={diagnosing}
                    className="bg-yellow-500 text-white p-6 rounded-2xl hover:bg-yellow-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-3 mb-2">
                        {diagnosing ? <Loader2 className="w-6 h-6 animate-spin" /> : <AlertTriangle className="w-6 h-6" />}
                        <h3 className="text-lg font-bold">Diagnose Issues</h3>
                    </div>
                    <p className="text-sm text-white/80">Find orphaned products and duplicates</p>
                </button>

                <button
                    onClick={handleAddVariants}
                    disabled={addingVariants}
                    className="bg-purple-500 text-white p-6 rounded-2xl hover:bg-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-3 mb-2">
                        {addingVariants ? <Loader2 className="w-6 h-6 animate-spin" /> : <Palette className="w-6 h-6" />}
                        <h3 className="text-lg font-bold">Add Variants</h3>
                    </div>
                    <p className="text-sm text-white/80">Add size/color variants to products</p>
                </button>
            </div>

            {/* Result Message */}
            {result && (
                <div className={`p-4 rounded-xl border-2 ${result.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <div className="flex items-center gap-2">
                        {result.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        <span className="font-medium">{result.message}</span>
                    </div>
                </div>
            )}

            {/* Database State */}
            {dbState && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Database className="w-6 h-6" />
                            Database Status
                        </h2>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <div className="text-2xl font-bold text-blue-600">{dbState.categories}</div>
                                <div className="text-sm text-blue-800">Categories</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl">
                                <div className="text-2xl font-bold text-green-600">{dbState.products}</div>
                                <div className="text-sm text-green-800">Products</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl">
                                <div className="text-2xl font-bold text-purple-600">{dbState.variants}</div>
                                <div className="text-sm text-purple-800">Variants</div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-xl">
                                <div className="text-2xl font-bold text-yellow-600">{dbState.reviews}</div>
                                <div className="text-sm text-yellow-800">Reviews</div>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-xl">
                                <div className="text-2xl font-bold text-pink-600">{dbState.cartItems}</div>
                                <div className="text-sm text-pink-800">Cart Items</div>
                            </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="space-y-2 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Database has data:</span>
                                {dbState.hasData ? (
                                    <span className="flex items-center gap-2 text-green-600 font-medium">
                                        <CheckCircle className="w-4 h-4" /> Yes
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 text-red-600 font-medium">
                                        <XCircle className="w-4 h-4" /> No
                                    </span>
                                )}
                            </div>

                            {dbState.products > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Variants per product:</span>
                                    <span className="font-medium text-gray-900">
                                        ~{Math.round(dbState.variants / dbState.products)} variants
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        {dbState.hasData && (
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <a href="/shop" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <Package className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-900">View Products</span>
                                    </a>
                                    <a href="/cart" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <ShoppingCart className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-900">View Cart</span>
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        {!dbState.hasData && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <h4 className="font-bold text-yellow-900 mb-2">Database is empty</h4>
                                <p className="text-sm text-yellow-800">
                                    Click "Seed Database" above to create sample data including categories, products, and variants.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-3">How to Test Cart</h3>
                <ol className="space-y-2 text-sm text-blue-800">
                    <li className="flex gap-2">
                        <span className="font-bold">1.</span>
                        <span>Click "Seed Database" to create sample products with variants</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">2.</span>
                        <span>Go to Shop page and select a product</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">3.</span>
                        <span>Choose size and color (variants from database)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">4.</span>
                        <span>Click "Add to Cart" - it should work now!</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold">5.</span>
                        <span>Check cart to see your selected variant</span>
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default DatabaseUtility;
