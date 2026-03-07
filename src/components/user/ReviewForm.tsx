import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StarRating from '../common/StarRating';

interface ReviewFormProps {
    onSubmit: (rating: number, comment: string) => Promise<void>;
    onCancel: () => void;
    initialRating?: number;
    initialComment?: string;
    isEditing?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    onSubmit,
    onCancel,
    initialRating = 0,
    initialComment = '',
    isEditing = false,
}) => {
    const { t } = useTranslation();
    const [rating, setRating] = useState<number>(initialRating);
    const [comment, setComment] = useState<string>(initialComment);
    const [submitting, setSubmitting] = useState(false);
    const [ratingError, setRatingError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setRatingError(true);
            return;
        }
        setRatingError(false);
        setSubmitting(true);

        try {
            await onSubmit(rating, comment.trim());
        } finally {
            setSubmitting(false);
        }
    };

    const ratingLabels: Record<number, string> = {
        1: t('productDetail.ratingTerrible'),
        2: t('productDetail.ratingPoor'),
        3: t('productDetail.ratingAverage'),
        4: t('productDetail.ratingGood'),
        5: t('productDetail.ratingExcellent'),
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
                {isEditing ? t('productDetail.updateReview') : t('productDetail.writeReview')}
            </h4>

            {/* Star Rating Picker */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('productDetail.yourRating')} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                    <StarRating value={rating} onChange={setRating} size={28} />
                    {rating > 0 && (
                        <span className="text-sm text-gray-500 animate-fade-in">
                            {ratingLabels[rating]}
                        </span>
                    )}
                </div>
                {ratingError && (
                    <p className="text-red-500 text-sm mt-1 animate-fade-in">
                        {t('productDetail.ratingRequired')}
                    </p>
                )}
            </div>

            {/* Comment */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('productDetail.yourComment')}
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder={t('productDetail.commentPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all resize-none text-gray-700 placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {t('productDetail.submitting')}</>
                    ) : (
                        isEditing ? t('productDetail.updateReview') : t('productDetail.submitReview')
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                >
                    {t('common.cancel')}
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;
