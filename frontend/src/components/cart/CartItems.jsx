import React from "react";

const CartItem = ({ item, updateQuantity, removeItem, formatNaira }) => {
    
  const currentQuantity = Number(item?.quantity || 1);
  const availableStock = Number(item?.stock || 0);

  return (
    <div className="flex items-center bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
      <img
        src={item?.image || "https://unsplash.com"}
        alt={item?.name || "Product Asset"}
        className="w-20 h-20 object-cover rounded-xl bg-gray-100 flex-shrink-0"
      />

      {/* Product Information Context Details Row */}
      <div className="ml-4 flex-1">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
          {item?.name}
        </h3>
        <p className="text-sm font-medium text-indigo-600 mt-1">
          {formatNaira(item?.price || 0)}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            
            <button
              type="button"
              onClick={() => updateQuantity(item.product, currentQuantity - 1)}
              disabled={currentQuantity <= 1}
              className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition font-semibold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              -
            </button>
            
            <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-white min-w-[2rem] text-center">
              {currentQuantity}
            </span>
            
            <button
              type="button"
              onClick={() => updateQuantity(item.product, currentQuantity + 1)}
              disabled={currentQuantity >= availableStock}
              className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition font-semibold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              +
            </button>

          </div>

          <button
            type="button"
            onClick={removeItem}
            onClick={() => removeItem(item.product)}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
