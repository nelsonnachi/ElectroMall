import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const shippingCost = subtotal > 0 ? 4500.0 : 0.0;
  const taxes = subtotal * 0.075;
  const total = subtotal + taxes + shippingCost;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCost,
      taxes,
      total
    }

    sessionStorage.setItem("orderItem", JSON.stringify(data))
    navigate("/process/payment")
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen px-4 py-8 md:px-8 lg:px-16 font-sans antialiased">
      {/* Header */}
      <header className="mb-10 max-w-7xl mx-auto border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Review Your Order
          </h1>
        </div>
        <div className="text-xs sm:text-right text-slate-500 font-medium">
          <p>Step 2 of 3</p>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cart Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-4 mb-2 flex justify-between items-center">
              <span>1. Shipment Items ({cartItems.length})</span>
              <button
                onClick={() => navigate("/cart")}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Edit
              </button>
            </h2>
            <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 pr-1 [&::-webkit-scrollbar]:hidden">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={" "}
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200/60"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Qty: {item.quantity} · {formatNaira(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {formatNaira(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
              <span>2. Delivery Details</span>
              <button
                onClick={() => navigate("/shipping")}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 17h2m-1-12a9 9 0 100 18 9 9 0 000-18z"
                  />
                </svg>
                Edit
              </button>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">
                  Shipping Address
                </span>
                <p>{shippingInfo.address}</p>
                <p>
                  {shippingInfo.city}, {shippingInfo.state}{" "}
                  {shippingInfo.country}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">
                  Contact Info
                </span>
                <p className="font-medium text-slate-900">
                  {shippingInfo.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-4 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm text-slate-600 pb-4 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatNaira(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (7.5%)</span>
                <span>{formatNaira(taxes)}</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline pt-4 mb-6">
              <span className="text-sm font-bold">Total to pay</span>
              <span className="text-2xl font-black">{formatNaira(total)}</span>
            </div>
            <button onClick={proceedToPayment} className="w-full bg-slate-900 text-white py-3.5 px-6 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
              Proceed to Payment
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
