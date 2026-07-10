import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CartItem from "./CartItems";
import OrderSummary from "./OrderSummary";
import WaveLoader from "../WaveLoader";

import { addItemsToCart } from "../../redux/features/cart/cartAPI";
import { removeItemFromCart } from "../../redux/features/cart/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { success, loading, error, message, cartItems } = useSelector(
    (state) => state.cart,
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  // Strips decimals completely to match the local formatting rule style
  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.floor(amount || 0));
  };

  const updateQuantity = (productId, newQuantity) => {
    dispatch(addItemsToCart({ id: productId, quantity: newQuantity }));
  };

  const removeItem = (productId) => {
    dispatch(removeItemFromCart(productId));
  };

  if (loading && (!cartItems || cartItems.length === 0)) return <WaveLoader />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center text-rose-600 font-semibold font-sans">
        <p className="text-xl mb-2">⚠️ Error loading shopping cart</p>
        <p className="text-sm text-slate-500 font-normal mb-6">
          {error?.message || error || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm transition hover:bg-slate-800"
        >
          Reload Page
        </button>
      </div>
    );
  }

  const subtotal = cartItems
    ? cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0,
      )
    : 0;
  const shipping = subtotal > 0 ? 4500.0 : 0;
  const tax = subtotal * 0.075;
  const total = subtotal + shipping + tax;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/shipping", { replace: true });
      return;
    }
    navigate("/login?redirect=/shipping", { replace: true });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 font-sans w-full">
      {/* Container configurations synced fluidly to mirror Navbar width fields perfectly */}
      <div className="container mx-auto px-6 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto mt-12">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/shop"
              className="inline-block w-full bg-indigo-600 text-white text-center font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-sm cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column Area: Items Stream */}
            <div className="lg:col-span-7 space-y-4">
              <div className="mb-2">
                <Link
                  to="/shop"
                  className="inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                >
                  &larr; Continue Shopping
                </Link>
              </div>
              {cartItems.map((item) => (
                <CartItem
                  key={item.product}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  formatNaira={formatNaira}
                />
              ))}
            </div>

            {/* Right Column Area: Order Summary Sticky Card */}
            <div className="lg:col-span-5 sticky top-6">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                handleCheckout={handleCheckout}
                formatNaira={formatNaira}
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
