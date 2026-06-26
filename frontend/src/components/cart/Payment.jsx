import React, { useState } from "react";
import { Link } from "react-router-dom";

const PaymentComponent = () => {
  const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
 
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentPayload = {
      method: paymentMethod,
      details: paymentMethod === "card" ? formData : null,
      sameAsShipping,
    };
    onNext(paymentPayload);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300">
      {/* Header Container with Steps Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Payment Method
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please select your preferred payment option below.
          </p>
        </div>

        {/* Your Step Indicator Block */}
        <div className="text-xs sm:text-right text-slate-500 font-medium self-start sm:self-center">
          <p>Step 3 of 3</p>
          <p className="text-slate-400 mt-0.5">All data is encrypted</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Method Grid Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card Option */}
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`relative flex flex-col p-4 rounded-xl border text-left transition-all duration-200 outline-none ${
              paymentMethod === "card"
                ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex justify-between items-center w-full mb-3">
              <span className="text-xl">💳</span>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "card"
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "card" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <span className="block text-sm font-semibold text-gray-900">
              Credit/Debit Card
            </span>
            <span className="block text-xs text-gray-500 mt-1">
              Visa, Mastercard, Amex
            </span>
          </button>

          {/* Bank Transfer Option */}
          <button
            type="button"
            onClick={() => setPaymentMethod("bank")}
            className={`relative flex flex-col p-4 rounded-xl border text-left transition-all duration-200 outline-none ${
              paymentMethod === "bank"
                ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex justify-between items-center w-full mb-3">
              <span className="text-xl">🏦</span>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "bank"
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "bank" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <span className="block text-sm font-semibold text-gray-900">
              Bank Transfer
            </span>
            <span className="block text-xs text-gray-500 mt-1">
              Direct wire or online banking
            </span>
          </button>

          {/* Cash on Delivery Option */}
          <button
            type="button"
            onClick={() => setPaymentMethod("cod")}
            className={`relative flex flex-col p-4 rounded-xl border text-left transition-all duration-200 outline-none ${
              paymentMethod === "cod"
                ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex justify-between items-center w-full mb-3">
              <span className="text-xl">💵</span>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "cod"
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "cod" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <span className="block text-sm font-semibold text-gray-900">
              Cash on Delivery
            </span>
            <span className="block text-xs text-gray-500 mt-1">
              Pay with cash upon arrival
            </span>
          </button>
        </div>

        {/* Dynamic Content Views */}
        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 transition-all duration-300">
          {/* Card Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleInputChange}
                  className="w-full mt-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Card Number
                </label>
                <input
                  type="text"
                  name="number"
                  placeholder="0000 0000 0000 0000"
                  required
                  onChange={handleInputChange}
                  className="w-full mt-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    required
                    onChange={handleInputChange}
                    className="w-full mt-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    maxLength="4"
                    required
                    onChange={handleInputChange}
                    className="w-full mt-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer Information */}
          {paymentMethod === "bank" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-800">
                Please wire the final amount to our corporate account:
              </p>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm space-y-1 text-gray-600 shadow-sm">
                <p>
                  <span className="font-semibold text-gray-800">Bank:</span>{" "}
                  Global Apex Bank
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Account Name:
                  </span>{" "}
                  Store E-Commerce Inc.
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Account Number:
                  </span>{" "}
                  9876-5432-1010
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Reference:
                  </span>{" "}
                  Your Order ID (will be given next)
                </p>
              </div>
              <p className="text-xs text-gray-500 italic">
                Your order will process once the payment transfer is confirmed
                by our team.
              </p>
            </div>
          )}

          {/* Cash on Delivery Information */}
          {paymentMethod === "cod" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">
                You have selected Cash on Delivery.
              </p>
              <p className="text-sm text-gray-600">
                Please ensure someone is available at your shipping address to
                settle the payment using cash or mobile POS when your package
                arrives.
              </p>
            </div>
          )}
        </div>

        {/* Global Billing Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500/30 transition cursor-pointer"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
            Billing address matches my shipping address
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
          <Link
            to="/shipping"
            className="w-full sm:w-auto text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 transition"
          >
            ← Back to Shipping
          </Link>
          <Link
            to="/order/confirm"
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/10 transition-all outline-none transform active:scale-95"
          >
            Go to Order Confirmation
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Payment;
