import React from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { toast } from 'react-toastify'; 
import { addItemsToCart } from '../../redux/features/cart/cartAPI';
import { removeItemFromCart } from '../../redux/features/cart/cartSlice';  

const ProductCard = ({ product }) => {
  const dispatch = useDispatch(); 
  
  const { cartItems } = useSelector((state) => state.cart);

  const targetId = product?._id || product?.id;
  const isOutOfStock = !product || Number(product?.stock || 0) <= 0; 

  const isAlreadyInCart = cartItems ? cartItems.some(item => item.product === targetId) : false;

  const imageUrl = product?.image?.[0]?.url || product?.image?.url || product?.image;

  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(product?.price || 0);

  const handleCartToggleClick = (e) => {
    // Prevents the outer Link from triggering when clicking the heart button
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("Sorry, this product is currently out of stock.");
      return;
    }

    if (isAlreadyInCart) {
       dispatch(removeItemFromCart(targetId));
    } else {
      dispatch(addItemsToCart({ id: targetId, quantity: 1 }));
    }
  };

  return (
    <Link 
      to={`/product/${targetId}`} 
      className="bg-white md:border md:border-gray-200 md:rounded-xl overflow-hidden md:shadow-sm md:hover:shadow-md transition-all flex flex-col group relative block"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-xl md:rounded-none">
        <img
          src={imageUrl}
          alt={product?.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
        />

        {/* Brand - Hidden on Mobile */}
        {product?.brand && (
          <span className="hidden md:block absolute bottom-3 left-3 z-10 rounded-md bg-white/85 px-2.5 py-1 text-[10px] font-bold tracking-wider text-gray-800 uppercase shadow-sm backdrop-blur-sm pointer-events-none border border-white/20">
            {product.brand}
          </span>
        )}

        {/* Heart Icon - Visible on both, custom positioned logic built-in */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleCartToggleClick} 
            className="absolute top-2 right-2 md:top-3 md:right-3 z-10 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
            aria-label={isAlreadyInCart ? "Remove from cart" : "Add to cart"}
          >
            <Heart
              size={18}
              className="transition-colors duration-200"
              color={isAlreadyInCart ? "#ef4444" : "#64748b"}
              fill={isAlreadyInCart ? "#ef4444" : "none"} 
            />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="pt-2 pb-4 md:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category - Hidden on Mobile */}
          <span className="hidden md:block text-[11px] text-gray-400 font-semibold uppercase tracking-wider block mb-1">
            {product?.category}
          </span>
          
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors flex-1">
              {product?.name}
            </h3>
            
            {/* Out of Stock tag - Hidden on Mobile */}
            {isOutOfStock && (
              <span className="hidden md:block shrink-0 bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-100 uppercase tracking-wide">
                Out of stock
              </span>
            )}
          </div>
        </div>
        
        {/* Price and Action Footer */}
        <div className="mt-1 md:mt-4 flex items-center justify-between md:border-t md:border-gray-100 md:pt-3">
          <span className="text-base font-bold text-gray-900">
            {formattedPrice}
          </span>

          {/* View Details Link - Hidden on Mobile because the entire card handles clicking */}
          <div className="hidden md:flex text-xs text-indigo-600 font-semibold items-center gap-0.5 hover:text-indigo-700 hover:underline cursor-pointer">
            View <ChevronRight size={14} />
          </div>
        </div>
      </div>

    </Link>
  );
};

export default ProductCard;
