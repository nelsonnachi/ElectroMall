import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createOrder,
  verifyPayment,
} from "../../redux/features/payment/paymentAPI";
import { clearCart } from "../../redux/features/cart/cartSlice";

const OrderConfirmation = () => {
  const { cartItems = [], shippingInfo = {} } = useSelector(
    (state) => state.cart,
  );
  const { currentOrder, status } = useSelector((state) => state.payment);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const shippingCost = subtotal > 0 ? 4500.0 : 0.0;
  const taxes = subtotal * 0.075;
  const total = subtotal + taxes + shippingCost;

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const createAndPay = async () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderPayload = {
      shippingInfo,
      orderItems: cartItems.map((item) => ({
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image,
        product: item.product,
      })),
      paymentInfo: {
        status: "Pending",
      },
      itemsPrice: subtotal,
      taxPrice: taxes,
      shippingPrice: shippingCost,
      totalPrice: total,
    };

    const resultAction = await dispatch(createOrder(orderPayload));
    if (createOrder.fulfilled.match(resultAction)) {
      const orderId = resultAction.payload?.order?._id;
      if (!orderId) {
        toast.error("Could not initialize order.");
        return;
      }

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: shippingInfo.email || "customer@example.com",
        amount: Math.round(total * 100),
        currency: "NGN",
        callback: (response) => {
          console.log("Paystack Reference Caught:", response.reference); // <-- Add this line
          console.log("Full Paystack Response Object:", response);
          dispatch(verifyPayment({ reference: response.reference, orderId }))
            .unwrap()
            .then(() => {
              dispatch(clearCart());
              toast.success("Payment successful and order saved.");
              navigate("/payment/success");
            })
            .catch((error) => {
              toast.error(error?.message || "Payment verification failed.");
            });
        },
        onClose: () => {
          toast.info("Payment cancelled.");
          navigate("/payment/cancelled");
        },
      });
      handler.openIframe();
    } else {
      toast.error(resultAction.payload?.message || "Unable to create order.");
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen px-4 py-8 md:px-8 lg:px-16 font-sans antialiased">
      {/* Header */}
      <header className="mb-8 max-w-7xl mx-auto border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Review Your Order
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Please confirm your items, delivery destination, and pricing totals
            before proceeding.
          </p>
        </div>
        <div className="text-xs sm:text-right text-slate-500 font-medium bg-slate-200/60 px-3 py-1.5 rounded-full self-start sm:self-auto">
          Step 2 of 3
        </div>
      </header>

      {/* Single Tabular Layout Container */}
      <main className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Desktop Table Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 bg-slate-900 text-white text-xs uppercase tracking-wider font-semibold py-4 px-6">
          <div className="col-span-1">Section</div>
          <div className="col-span-7">Details Summary</div>
          <div className="col-span-4 text-right">Actions / Financials</div>
        </div>

        <div className="divide-y divide-slate-200">
          {/* ROW 1: SHIPMENT ITEMS */}
          <div className="grid grid-cols-1 md:grid-cols-12 align-top hover:bg-slate-50/50 transition-colors p-6 gap-4 md:gap-0">
            <div className="md:col-span-1 font-bold text-slate-500 whitespace-nowrap">
              01. Items
            </div>
            <div className="md:col-span-7">
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=" "
                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-800 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Qty: {item.quantity} × {formatNaira(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-700">
                      {formatNaira(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-4 text-left md:text-right">
              <button
                onClick={() => navigate("/cart")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md"
              >
                Modify Cart ({cartItems.length})
              </button>
            </div>
          </div>

          {/* ROW 2: DELIVERY DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-12 align-top hover:bg-slate-50/50 transition-colors p-6 gap-4 md:gap-0">
            <div className="md:col-span-1 font-bold text-slate-500 whitespace-nowrap">
              02. Shipping
            </div>
            <div className="md:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Destination Address
                  </span>
                  <p className="text-slate-700 font-medium">
                    {shippingInfo.address}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {shippingInfo.city}, {shippingInfo.state},{" "}
                    {shippingInfo.country}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Primary Recipient Contact
                  </span>
                  <p className="text-slate-700 font-medium">
                    {shippingInfo.phoneNumber}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Standard Dispatch Delivery
                  </p>
                </div>
              </div>
            </div>
            {/* Explicitly placeholder block keeping alignment synced */}
            <div className="hidden md:block md:col-span-4"></div>
          </div>

          {/* ROW 3: TOTALS & FINAL ACTION BUTTON */}
          <div className="grid grid-cols-1 md:grid-cols-12 align-top hover:bg-slate-50/50 transition-colors p-6 gap-4 md:gap-0">
            <div className="md:col-span-1 font-bold text-slate-500 whitespace-nowrap">
              03. Summary
            </div>
            <div className="md:col-span-7">
              <div className="space-y-2 max-w-md">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>VAT (7.5%)</span>
                  <span>{formatNaira(taxes)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Shipping Fee</span>
                  <span>{formatNaira(shippingCost)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-slate-900">
                  <span>Estimated Total Due</span>
                  <span className="text-base text-blue-600">
                    {formatNaira(total)}
                  </span>
                </div>
              </div>
            </div>
            <div className="md:col-span-4 flex items-end justify-start md:justify-end pt-4 md:pt-0">
              <button
                onClick={createAndPay}
                disabled={status === "loading"}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading"
                  ? "Processing Order..."
                  : "Confirm & Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
