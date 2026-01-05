import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';

const CATEGORY_IMAGES: Record<string, string> = {
    men: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
    women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    outerwear: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
};

const CategoryShowcase: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data.slice(0, 4)); // Max 4 categories
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
                <p className="text-gray-500">Find exactly what you're looking for</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {categories.map((category, index) => (
                    <Link
                        key={category.id}
                        to={`/shop?category=${category.slug || category.name.toLowerCase()}`}
                        className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Image */}
                        <img
                            src={CATEGORY_IMAGES[category.slug?.toLowerCase() || category.name.toLowerCase()] || CATEGORY_IMAGES.men}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:translate-y-0 translate-y-2 transition-transform">
                                {category.name}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                {category.productCount || 0} Products
                            </p>
                            <div className="flex items-center gap-2 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                Shop Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryShowcase;
