import React from 'react';

const SkeletonProductCard: React.FC = () => {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col h-full animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 h-64 md:h-80 relative"></div>

            {/* Content Skeleton */}
            <div className="p-4 flex flex-col flex-1 space-y-3">
                {/* Category & Title */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>

                <div className="mt-auto pt-4 space-y-2">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    {/* Price */}
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonProductCard;
