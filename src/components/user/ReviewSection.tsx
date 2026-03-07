import React, { useEffect, useState, useMemo } from 'react';
import { MessageSquare, LogIn, Star, ChevronDown, Trash2, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import { Review } from '../../types';
import StarRating from '../common/StarRating';
import ReviewForm from './ReviewForm';

interface ReviewSectionProps {
    productId: number;
    onStatsChange?: (stats: { average: number; total: number }) => void;
}

type SortOption = 'newest' | 'highest' | 'lowest';

const REVIEWS_PER_PAGE = 5;

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, onStatsChange }) => {
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated } = useAuth();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [filterStar, setFilterStar] = useState<number>(0); // 0 = all
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            const data = await reviewService.getReviewsByProductId(productId);
            setReviews(data);
            setLoading(false);
        };
        fetchReviews();
    }, [productId]);

    // Computed stats
    const stats = useMemo(() => {
        if (reviews.length === 0) return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };

        const distribution = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars
        let sum = 0;
        reviews.forEach((r) => {
            const rating = r.rating || 0;
            sum += rating;
            if (rating >= 1 && rating <= 5) distribution[rating - 1]++;
        });

        return {
            average: sum / reviews.length,
            total: reviews.length,
            distribution,
        };
    }, [reviews]);

    // Notify parent about stats changes
    useEffect(() => {
        if (onStatsChange) {
            onStatsChange({ average: stats.average, total: stats.total });
        }
    }, [stats, onStatsChange]);

    // Filtered & sorted reviews
    const displayedReviews = useMemo(() => {
        let filtered = filterStar > 0 ? reviews.filter((r) => r.rating === filterStar) : [...reviews];

        switch (sortBy) {
            case 'highest':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'lowest':
                filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
                break;
        }

        return filtered;
    }, [reviews, filterStar, sortBy]);

    // Paginated reviews
    const paginatedReviews = useMemo(() => {
        return displayedReviews.slice(0, visibleCount);
    }, [displayedReviews, visibleCount]);

    // Reset visible count when filter/sort changes
    useEffect(() => {
        setVisibleCount(REVIEWS_PER_PAGE);
    }, [filterStar, sortBy]);

    // Check if current user already has a review
    const userExistingReview = useMemo(() => {
        if (!user) return null;
        return reviews.find((r) => r.user_id === user.id) || null;
    }, [reviews, user]);

    // Handlers
    const handleSubmitReview = async (rating: number, comment: string) => {
        if (!user) return;

        try {
            const newReview = await reviewService.submitReview({
                productId,
                userId: user.id,
                rating,
                comment,
            });
            if (newReview) {
                setReviews((prev) => [newReview, ...prev]);
                setShowForm(false);
                message.success(t('productDetail.reviewSubmitted'));
            }
        } catch (error: any) {
            // Check for duplicate review (unique constraint violation)
            if (error?.code === '23505') {
                message.error(t('productDetail.duplicateReview'));
            } else {
                message.error(t('productDetail.errorOccurred'));
            }
        }
    };

    const handleUpdateReview = async (rating: number, comment: string) => {
        if (!editingReview) return;

        try {
            const updated = await reviewService.updateReview(editingReview.id, { rating, comment });
            if (updated) {
                setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
                setEditingReview(null);
                message.success(t('productDetail.reviewUpdated'));
            }
        } catch {
            message.error(t('productDetail.errorOccurred'));
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        // Confirm dialog before deleting
        const confirmed = window.confirm(t('productDetail.confirmDeleteReview'));
        if (!confirmed) return;

        try {
            await reviewService.deleteReview(reviewId);
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
            message.success(t('productDetail.reviewDeleted'));
        } catch {
            message.error(t('productDetail.errorOccurred'));
        }
    };

    const handleWriteReview = () => {
        if (userExistingReview) {
            setEditingReview(userExistingReview);
            setShowForm(false);
        } else {
            setShowForm(true);
            setEditingReview(null);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        return new Date(dateStr).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <section className="mt-16 pt-12 border-t border-gray-100">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {t('productDetail.customerReviews')}
                </h2>
                {isAuthenticated && (
                    <button
                        onClick={handleWriteReview}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-900/10"
                    >
                        <MessageSquare size={16} />
                        {userExistingReview ? t('productDetail.updateReview') : t('productDetail.writeReview')}
                    </button>
                )}
            </div>

            {/* Rating Summary */}
            {stats.total > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    {/* Average Rating */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-5xl font-extrabold text-gray-900 mb-1">
                            {stats.average.toFixed(1)}
                        </p>
                        <StarRating value={Math.round(stats.average)} readonly size={22} />
                        <p className="text-sm text-gray-500 mt-2">
                            {t('productDetail.basedOnReviews', { count: stats.total })}
                        </p>
                    </div>

                    {/* Star Distribution */}
                    <div className="md:col-span-2 space-y-2">
                        <p className="text-sm font-semibold text-gray-600 mb-3">{t('productDetail.ratingDistribution')}</p>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.distribution[star - 1];
                            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                            const isActive = filterStar === star;

                            return (
                                <button
                                    key={star}
                                    onClick={() => setFilterStar(isActive ? 0 : star)}
                                    className={`w-full flex items-center gap-3 group py-1 px-2 rounded-lg transition-all ${isActive ? 'bg-yellow-50 ring-1 ring-yellow-200' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-sm font-semibold text-gray-700 w-6">{star}</span>
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Filter & Sort Controls */}
            {stats.total > 0 && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        {filterStar > 0 && (
                            <button
                                onClick={() => setFilterStar(0)}
                                className="text-sm text-primary-600 hover:underline font-medium"
                            >
                                {t('productDetail.allRatings')} ✕
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer"
                        >
                            <option value="newest">{t('productDetail.sortNewest')}</option>
                            <option value="highest">{t('productDetail.sortHighest')}</option>
                            <option value="lowest">{t('productDetail.sortLowest')}</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Review Form (New) */}
            {showForm && (
                <div className="mb-8 animate-fade-in">
                    <ReviewForm
                        onSubmit={handleSubmitReview}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Review Form (Edit) */}
            {editingReview && (
                <div className="mb-8 animate-fade-in">
                    <ReviewForm
                        onSubmit={handleUpdateReview}
                        onCancel={() => setEditingReview(null)}
                        initialRating={editingReview.rating || 0}
                        initialComment={editingReview.comment || ''}
                        isEditing
                    />
                </div>
            )}

            {/* Login Prompt */}
            {!isAuthenticated && (
                <div className="text-center py-6 mb-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <LogIn className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">{t('productDetail.loginToReview')}</p>
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex gap-4 p-6 bg-gray-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/6" />
                                <div className="h-3 bg-gray-200 rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : displayedReviews.length === 0 ? (
                <div className="text-center py-16">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium text-lg">
                        {filterStar > 0
                            ? t('productDetail.noReviewsForStar', { star: filterStar })
                            : t('productDetail.noReviews')}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {paginatedReviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    {review.userAvatar ? (
                                        <img
                                            src={review.userAvatar}
                                            alt={review.userName}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                            {(review.userName || 'A').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div>
                                            <span className="font-semibold text-gray-900 text-sm">
                                                {review.userName || 'Anonymous'}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-2">
                                                {formatDate(review.created_at)}
                                            </span>
                                        </div>

                                        {/* Edit/Delete for own reviews */}
                                        {user && review.user_id === user.id && !editingReview && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setEditingReview(review)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                                                    title="Sửa đánh giá"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                    title="Xóa đánh giá"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <StarRating value={review.rating || 0} readonly size={16} />

                                    {review.comment && (
                                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Load More Button */}
                    {visibleCount < displayedReviews.length && (
                        <div className="text-center pt-4">
                            <button
                                onClick={() => setVisibleCount((prev) => prev + REVIEWS_PER_PAGE)}
                                className="px-8 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                {t('productDetail.loadMoreReviews')} ({displayedReviews.length - visibleCount} {t('productDetail.remaining')})
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default ReviewSection;
