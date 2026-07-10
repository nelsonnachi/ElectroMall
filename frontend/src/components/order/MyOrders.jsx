import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getAllMyOrders } from "../../redux/features/order/orderAPI";
import { removeErrors } from "../../redux/features/order/orderSlice";
import WaveLoader from "../WaveLoader";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, error, loading } = useSelector((state) => state.order || {});

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.floor(amount || 0));
  };

  useEffect(() => {
    dispatch(getAllMyOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  if (loading) return <WaveLoader />;

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 text-center px-6 py-12 bg-white rounded-2xl border border-slate-100 shadow-xs">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 text-slate-400 mb-5 border border-slate-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">No orders placed yet</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Your shopping cart history is empty. Start exploring our store to find your next purchase!
        </p>
        <div className="mt-6">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            Explore the Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    /* FIXED: Adjusted wrapper from max-w-5xl to max-w-7xl to exactly follow global layout container grids */
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 font-sans w-full">
      
      {/* Header section with minimal typography */}
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Order History</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          You have placed a total of <span className="font-semibold text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md">{orders.length}</span> orders.
        </p>
      </div>

      {/* Main Table Grid Container */}
      <div className="overflow-hidden border border-slate-200/80 rounded-xl shadow-xs bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 bg-white text-left text-sm">
            
            <thead className="bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4">Order ID</th>
                <th scope="col" className="px-6 py-4">Items Count</th>
                <th scope="col" className="px-6 py-4">Delivery Status</th>
                <th scope="col" className="px-6 py-4">Total Price</th>
                <th scope="col" className="px-6 py-4 text-center">View Orders</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const itemsCount = order.orderItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

                return (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    
                    {/* Order ID Column */}
                    <td className="px-6 py-4 font-mono text-xs text-slate-900 font-medium whitespace-nowrap">
                      {order._id}
                    </td>

                    {/* Quantity Counter Column */}
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {itemsCount} {itemsCount === 1 ? "item" : "items"}
                    </td>

                    {/* Optimized orderStatus Mapping Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border
                        ${
                          order.orderStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : order.orderStatus === "Shipped"
                              ? "bg-sky-50 text-sky-700 border-sky-200/60"
                              : "bg-amber-50 text-amber-700 border-amber-200/60"
                        }
                      `}
                      >
                        {/* Dot indicator inside the status badge */}
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.orderStatus === "Delivered" ? "bg-emerald-500" : order.orderStatus === "Shipped" ? "bg-sky-500" : "bg-amber-500"
                        }`} />
                        {order.orderStatus || "Processing"}
                      </span>
                    </td>

                    {/* Total Price Column */}
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap tracking-tight">
                      {formatNaira(order.totalPrice)}
                    </td>

                    {/* Navigation Link Column */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer"
                        title="View Full Details" 
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
