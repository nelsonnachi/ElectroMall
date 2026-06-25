import React from "react";

const OrderSummary = ({
  subtotal,
  shipping,
  tax,
  total,
  handleCheckout,
  formatNaira,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Financial Fee Item Breakdown Lines */}
      <div className="space-y-4 border-b border-gray-100 pb-6 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">
            {formatNaira(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span className="font-semibold text-gray-900">
            {formatNaira(shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>VAT (7.5%)</span>
          <span className="font-semibold text-gray-900">
            {formatNaira(tax)}
          </span>
        </div>
      </div>

      {/* Aggregate Grand Total Box display area */}
      <div className="flex justify-between items-center my-6">
        <span className="text-base font-semibold text-gray-900">
          Total amount
        </span>
        <span className="text-2xl font-bold text-indigo-600">
          {formatNaira(total)}
        </span>
      </div>

      {/* Checkout Submission Form block wrapping */}
      <form onSubmit={handleCheckout} className="space-y-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl hover:bg-indigo-700 active:scale-[0.99] transition shadow-lg shadow-indigo-600/10 mt-2"
        >
          Proceed to Checkout
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
        🔒 Secure 256-bit SSL encrypted checkout
      </p>
    </div>
  );
};

export default OrderSummary;
