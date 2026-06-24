import React, { useState } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import {Link} from 'react-router-dom'

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const imageUrl = product?.image?.[0]?.url || product?.image?.url || product?.image;

  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(product?.price || 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
      
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product?.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {product?.brand && (
          <span className="absolute bottom-3 left-3 z-10 rounded-md bg-white/85 px-2.5 py-1 text-[10px] font-bold tracking-wider text-gray-800 uppercase shadow-sm backdrop-blur-sm pointer-events-none border border-white/20">
            {product.brand}
          </span>
        )}

        <button
          type="button"
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 z-10 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            className="transition-colors duration-200"
            color={isFavorite ? "#ef4444" : "#64748b"}
            fill={isFavorite ? "#ef4444" : "none"}
          />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag Only */}
          <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider block mb-1">
            {product?.category}
          </span>
          
          {/* Product Title */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product?.name}
          </h3>
        </div>
        
        {/* Footer pricing and click action */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-base font-bold text-gray-900">
            {formattedPrice}
          </span>

          <Link 
            to={`/product/${product?._id || product?.id}`}
            className="text-xs text-blue-600 font-semibold flex items-center gap-0.5 hover:text-blue-700 hover:underline cursor-pointer"
          >
            View Details <ChevronRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
