import React, { useState } from 'react';

const Rating = ({ totalRatingsCount = 124, onRatingSelect }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingClick = (value) => {
    setRating(value);
    if (onRatingSelect) onRatingSelect(value); 
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-100 bg-white p-4 shadow-sm select-none">
      
      <div className="flex items-center justify-between">
        {/* Dynamic global metrics counter */}
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-700 block">
            {totalRatingsCount + (rating > 0 ? 1 : 0)} Ratings
          </span>
        </div>
      </div>

      {/* Star Interaction Area */}
      <div className="mt-4 flex items-center justify-between bg-slate-50/50 rounded-lg p-2.5 border border-slate-100/50">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isHighlighted = hoverRating ? starValue <= hoverRating : starValue <= rating;
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => handleRatingClick(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform duration-100 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                aria-label={`Rate ${starValue} stars out of 5`}
              >
                <svg
                  xmlns="http://www.w3.org"
                  viewBox="0 0 24 24"
                  fill={isHighlighted ? "#eab308" : "#cbd5e1"} // Yellow-500 or Slate-300
                  className="h-6 w-6 transition-colors duration-150"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Dynamic Context Score Tag */}
        <span className="text-xs font-bold text-slate-700 bg-white shadow-xs px-2 py-1 rounded-md min-w-12.5 text-center border border-slate-100">
          {rating > 0 ? `${rating}.0 / 5` : "0.0"}
        </span>
      </div>

    </div>
  );
};

export default Rating;
