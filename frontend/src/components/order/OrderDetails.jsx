import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import WaveLoader from "../WaveLoader";
import { removeErrors } from "../../redux/features/order/orderSlice";
import { getOrderDetails } from "../../redux/features/order/orderAPI";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    loading,
    error,
    order = {},
  } = useSelector((state) => state.order || {});

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.floor(amount || 0));
  };

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    totalPrice = 0,
    orderStatus = "Processing",
    taxPrice = 0,
    shippingPrice = 0,
    itemsPrice = 0,
    paidAt,
  } = order;

  const formattedDate = paidAt
    ? new Date(paidAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  if (loading) return <WaveLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans w-full min-h-screen bg-slate-50/50">
      <div className="mb-8">
        <Link
          to="/my/orders"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Order History
        </Link>
        <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Order Details
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-mono">
          ID:{" "}
          <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {id}
          </span>
        </p>
      </div>

      {/* Main Structural Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Order Items & Shipping Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Order Items Table Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Order Items</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 bg-white text-left text-sm">
                <thead className="bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderItems.map((item, index) => (
                    <tr
                      key={item.product || index}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-6 h-6 text-slate-300"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                              />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-slate-600 whitespace-nowrap">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900 whitespace-nowrap">
                        {formatNaira(item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Shipping Information Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                Shipping Information
              </h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 sm:border-b sm:border-slate-100 sm:pb-5">
                <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Delivery Address
                </dt>
                <dd className="text-sm text-slate-800 sm:col-span-2 font-medium">
                  {`${shippingInfo.address || ""}, ${shippingInfo.city || ""}, ${shippingInfo.state || ""}, ${shippingInfo.postalCode || ""}`}
                </dd>
              </dl>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 pt-4">
                <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Phone Number
                </dt>
                <dd className="text-sm text-slate-800 sm:col-span-2 font-mono font-medium">
                  {shippingInfo.phoneNumber || "N/A"}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Order Summary (Sticky on Desktop Viewports) */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                Order Summary
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Dynamic Status Badges */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-500">
                  Order Status
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border
                    ${
                      orderStatus === "Delivered"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                        : orderStatus === "Shipped"
                          ? "bg-sky-50 text-sky-700 border-sky-200/60"
                          : "bg-amber-50 text-amber-700 border-amber-200/60"
                    }
                    `}
                >
                  {orderStatus}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-500">
                  Payment Status
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border
                  ${
                    paymentInfo?.status === "success"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                      : "bg-amber-50 text-amber-700 border-amber-200/60"
                  }
                `}
                >
                  {paymentInfo?.status === "success" ? "Paid" : "Not Paid"}
                </span>
              </div>

              {/* Data Properties formatted in Naira */}
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">Paid At</span>
                <span className="font-medium text-slate-800">
                  {formattedDate}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="font-medium text-slate-500">Item Price</span>
                <span className="font-medium text-slate-800">
                  {formatNaira(itemsPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">
                  Shipping Price
                </span>
                <span className="font-medium text-slate-800">
                  {formatNaira(shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">Total Price</span>
                <span className="font-bold text-lg text-slate-800">
                  {formatNaira(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
