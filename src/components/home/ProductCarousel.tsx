import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import ProductCard from '../user/ProductCard';

interface ProductCarouselProps {
    title: string;
    subtitle?: string;
    products: Product[];
    loading?: boolean;
    viewAllLink?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
    title,
    subtitle,
    products,
    loading = false,
    viewAllLink = '/shop',
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320; // Card width + gap
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(checkScroll, 300);
        }
    };

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="flex gap-6 overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="min-w-[280px] aspect-[3/4] bg-gray-200 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
                    {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-4">
                    <Link to={viewAllLink} className="text-primary-600 font-medium hover:text-primary-700 hidden sm:flex items-center gap-1">
                        View All <ChevronRight size={16} />
                    </Link>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Carousel */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[280px] max-w-[280px]">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Mobile View All */}
            <div className="mt-6 text-center sm:hidden">
                <Link to={viewAllLink} className="inline-flex items-center gap-2 text-primary-600 font-medium">
                    View All Products <ChevronRight size={16} />
                </Link>
            </div>
        </section>
    );
};

export default ProductCarousel;
