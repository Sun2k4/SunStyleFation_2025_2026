import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    text: string;
    role: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        text: 'SunStyle has completely transformed my wardrobe! The quality is amazing and the AI stylist helped me find the perfect outfit for my beach vacation. Highly recommended!',
        role: 'Loyal Customer',
    },
    {
        id: 2,
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=3',
        rating: 5,
        text: 'Fast shipping, great customer service, and the clothes fit perfectly. The summer collection is exactly what I needed. Will definitely be ordering again!',
        role: 'Premium Member',
    },
    {
        id: 3,
        name: 'Emily Davis',
        avatar: 'https://i.pravatar.cc/150?img=5',
        rating: 5,
        text: 'I love how easy it is to find matching accessories. The AI chat feature is so helpful - it recommended the perfect bag to match my new dress!',
        role: 'Fashion Enthusiast',
    },
    {
        id: 4,
        name: 'David Wilson',
        avatar: 'https://i.pravatar.cc/150?img=8',
        rating: 5,
        text: 'Best online shopping experience I have had. The materials are sustainable and the styles are trendy. SunStyle is now my go-to fashion store!',
        role: 'Verified Buyer',
    },
];

const Testimonials: React.FC = () => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const current = TESTIMONIALS[currentIndex];

    return (
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('testimonials.title')}</h2>
                    <p className="text-gray-500">{t('testimonials.subtitle')}</p>
                </div>

                {/* Testimonial Card */}
                <div className="relative">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-6 text-primary-100">
                            <Quote size={80} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        className={i < current.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                    />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
                                "{current.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={current.avatar}
                                    alt={current.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-primary-200"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{current.name}</h4>
                                    <p className="text-sm text-gray-500">{current.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-primary-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
