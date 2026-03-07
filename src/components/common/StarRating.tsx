import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    size?: number;
    readonly?: boolean;
    showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    value,
    onChange,
    size = 20,
    readonly = false,
    showValue = false,
}) => {
    const [hoverValue, setHoverValue] = useState<number>(0);

    const displayValue = hoverValue || value;

    return (
        <div className="inline-flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= displayValue;
                const isHalf = !isFilled && star - 0.5 <= displayValue;

                return (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => onChange?.(star)}
                        onMouseEnter={() => !readonly && setHoverValue(star)}
                        onMouseLeave={() => !readonly && setHoverValue(0)}
                        className={`
              transition-all duration-150 
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'}
              ${!readonly && hoverValue >= star ? 'drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]' : ''}
            `}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                        <Star
                            size={size}
                            className={`transition-colors duration-150 ${isFilled || isHalf
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                        />
                    </button>
                );
            })}
            {showValue && (
                <span className="ml-1 text-sm font-semibold text-gray-700">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
