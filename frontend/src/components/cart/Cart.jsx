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

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const updateQuantity = (productId, newQuantity) => {
    dispatch(addItemsToCart({ id: productId, quantity: newQuantity }));
  };

  const removeItem = (productId) => {
    dispatch(removeItemFromCart(productId));
  };

  // Render a loading indicator while your cart state processes operations
  if (loading && (!cartItems || cartItems.length === 0)) return <WaveLoader />;

  // Conditional Page Wrappers: Render a safe fallback boundary layout if a severe error occurs
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
  const shipping = subtotal > 0 ? 4500.0 : 0; // Flat local shipping rate fee inside Nigeria
  const tax = subtotal * 0.075; // 7.5% standard Nigerian VAT rate rules
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
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {!cartItems || cartItems.length === 0 ? (
          /* Clean Empty Card State layout if your items drop down to zero elements */
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto mt-12">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-block w-full bg-indigo-600 text-white text-center font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Product rows display card stream */}
            <div className="lg:col-span-7 space-y-4">
              {/* Continue Shopping Link */}
              <div className="mt-6">
                <Link
                  to="/shop"
                  className="inline-block text-indigo-600 font-semibold hover:text-indigo-800 transition"
                >
                  ← Continue Shopping
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

            {/* Right Column: Checkout Financial Summary Form Panel */}
            <div className="lg:col-span-5">
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
