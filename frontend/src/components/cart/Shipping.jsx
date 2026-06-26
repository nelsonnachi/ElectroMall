import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../../redux/features/cart/cartSlice";

const Shipping = () => {
  const { cartItems = [], shippingInfo = {} } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const [address, setAddress] = useState(shippingInfo?.address || "");
  const [city, setCity] = useState(shippingInfo?.city || "");
  const [country, setCountry] = useState(shippingInfo?.country || "Nigeria");
  const [state, setState] = useState(shippingInfo?.state || "");
  const [postalCode, setPostalCode] = useState(shippingInfo?.postalCode || "");
  const [phoneNumber, setPhoneNumber] = useState(shippingInfo?.phoneNumber || "");

  const shippingInfoSubmit = (e) => {
    e.preventDefault();

    // Cleans potential empty tracking or formatting characters
    const cleanPhone = phoneNumber.replace(/\s+/g, "");
    if (cleanPhone.length !== 11) {
      toast.error("Invalid Phone number. It should be 11 digits");
      return;
    }

    dispatch(
      saveShippingInfo({
        address,
        city,
        phoneNumber: cleanPhone,
        country,
        state,
        postalCode,
      })
    );

    navigate('/order/confirm');
  };

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const shippingCost = subtotal > 0 ? 4500.0 : 0.0;
  const taxes = subtotal * 0.075;
  const total = subtotal + taxes + shippingCost;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-8 md:px-8 lg:px-16 font-sans antialiased">
      {/* Secure Checkout Header */}
      <header className="mb-10 max-w-7xl mx-auto border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            Secure Checkout
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Shipping & Logistics
          </h1>
        </div>
        <div className="text-xs sm:text-right text-slate-500 font-medium">
          <p>Step 1 of 3</p>
          <p className="text-slate-400 mt-0.5">All data is encrypted</p>
        </div>
      </header>

      {/* Grid Content Frame */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form
          onSubmit={shippingInfoSubmit}
          className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 lg:col-span-7 space-y-6 shadow-sm"
        >
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-4 mb-2">
              1. Delivery Destination
            </h2>
            <p className="text-xs text-slate-500">
              Please enter your primary delivery destination address details below.
            </p>
          </div>

          <div>
            <label htmlFor="address" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="country" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
              >
                <option value="Nigeria">Nigeria</option>
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                placeholder="Abuja"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                State
              </label>
              <input
                type="text"
                id="state"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                placeholder="FCT"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                placeholder="900001"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                placeholder="08012345678"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4">
            <Link
              to="/cart"
              className="w-full sm:w-auto text-center px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back to Cart
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto bg-slate-900 text-white py-3 px-6 rounded-lg text-sm font-bold tracking-wide transition-all hover:bg-slate-800 active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
            >
              Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>

        {/* Right Column: Order Pricing Sticky Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-4 mb-4">
              Summary
            </h2>
            
            <div className="space-y-3 text-sm text-slate-600 pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">{formatNaira(shippingCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>VAT (7.5%)</span>
                <span className="font-semibold text-slate-900">{formatNaira(taxes)}</span>
              </div>
            </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-base font-semibold text-gray-900">
                <span>Total Due</span>
                <span>{formatNaira(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Shipping;