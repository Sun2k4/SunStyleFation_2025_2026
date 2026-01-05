import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Tag } from 'lucide-react';
import { Category } from '../../../types';
import { categoryService } from '../../../services/categoryService';
import { message, Modal } from 'antd';
import { seedDatabase } from '../../../utils/seedData';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            message.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSeedData = async () => {
        setLoading(true);
        try {
            await seedDatabase();
            message.success('Database seeded successfully!');
            fetchCategories();
        } catch (error) {
            message.error('Failed to seed database');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (!formData.name || !formData.slug) {
                message.warning('Name and Slug are required');
                return;
            }

            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData);
                message.success('Category updated successfully');
            } else {
                await categoryService.createCategory(formData);
                message.success('Category created successfully');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            message.error('Failed to save category');
        }
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Are you sure?',
            content: 'This will delete the category permanently.',
            onOk: async () => {
                try {
                    await categoryService.deleteCategory(id);
                    message.success('Category deleted');
                    fetchCategories();
                } catch (error) {
                    message.error('Failed to delete');
                }
            }
        });
    };

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        if (!editingCategory) {
            const slug = name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, name, slug }));
        } else {
            setFormData(prev => ({ ...prev, name }));
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500">Manage product categories</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSeedData}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Tag size={20} />
                        <span>Seed Data</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Add Category</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm">
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Slug</th>
                                <th className="px-6 py-4 font-semibold">Description</th>
                                <th className="px-6 py-4 font-semibold text-center">Products</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No categories found</td></tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary-50 p-2 rounded-lg text-primary-600 group-hover:bg-primary-100 transition-colors">
                                                    <Tag size={18} />
                                                </div>
                                                <span className="font-medium text-gray-900">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{category.slug}</code>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                                            {category.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {category.productCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simple Modal Implementation */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Summer Collection"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g. summer-collection"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10"
                            >
                                Save Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
