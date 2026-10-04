import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ value = 0, readOnly = false, onRate, size = 'md' }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentDisplayValue = hoverValue || value || 0;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= currentDisplayValue;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onRate && onRate(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer transform hover:scale-110'} transition-all focus:outline-none`}
            title={!readOnly ? `Rate ${star} star${star > 1 ? 's' : ''}` : `${value} Stars`}
          >
            <Star
              className={`${starSizes[size]} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-slate-600 fill-slate-800'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
