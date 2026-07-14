import React, { useState, useEffect } from "react";
import { Edit, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { deleteOrder, getAllOrders } from "../../redux/features/admin/adminAPI";
import WaveLoader from "../WaveLoader";
import {
  removeErrors,
  clearMessage,
} from "../../redux/features/admin/adminSlice";
import Pagination from "../product/Pagination";

const AllOrders = () => {
  const {
    orders = [],
    error,
    loading,
    deleting,
    message,
    totalPages = 1,
  } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  // ==================================================================S

   const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  
  // Filtering orders based on date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getAllOrders({ startDate, endDate, page }));
  }, [dispatch, page]);

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  // ===================================================================F

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      dispatch(removeErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, message, dispatch]);

  const handleDelete = (orderId) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete order ${orderId}?`,
    );
    if (!isConfirmed) return;
    dispatch(deleteOrder(orderId));
  };

  if (loading) return <WaveLoader />;
  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        Error:{" "}
        {error?.message ||
          (typeof error === "string" ? error : "Failed to load orders.")}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section Component Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Order Management
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor transaction volumes, track processing states, and manage
            client fulfillments.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-2 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500 font-medium px-1">From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          />
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500 font-medium px-1">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          />
        </div>

        {/* Filter Submit button triggers */}
        {/* 5. Set the page to 1 whenever a new search filter is applied */}
        {/* Apply Button */}
        <button
          onClick={() => {
            searchParams.set("page", "1");
            setSearchParams(searchParams);
            dispatch(getAllOrders({ startDate, endDate, page: 1 }));
          }}
          disabled={!startDate || !endDate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
        >
          Apply
        </button>

        {/* Clear Button */}
        {(startDate || endDate) && (
          <button
            onClick={resetFilter} // 👈 Handled exclusively by resetFilter now
            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Clear Filter Parameters"
          >
            Clear
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left text-sm text-gray-600 min-w-200">
            {/* Header Columns Panels */}
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 select-none">
              <tr>
                <th scope="col" className="px-6 py-4 w-16">
                  S/N
                </th>
                <th scope="col" className="px-6 py-4">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Total Price
                </th>
                <th scope="col" className="px-6 py-4">
                  Number of Items
                </th>
                <th scope="col" className="px-6 py-4 text-center w-28">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Dynamic Content Grid Mapper */}
            <tbody className="divide-y divide-gray-200 bg-white font-medium text-gray-700">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ShoppingBag className="w-8 h-8 text-gray-300" />
                      <p className="font-semibold text-gray-500">
                        No orders found
                      </p>

                      <p className="text-xs text-gray-400">
                        {startDate || endDate
                          ? "No transactions found matching this specific time parameter window."
                          : "Your transaction sales log is currently empty."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const isThisOrderDeleting = deleting?.[order._id];
                  const itemsCount = order.orderItems?.length || 0;

                  return (
                    <tr
                      key={order._id}
                      className={`transition-colors ${isThisOrderDeleting ? "bg-red-50/40" : "hover:bg-gray-50/70"}`}
                    >
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                        {(page - 1) * 10 + (index + 1)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-bold font-mono tracking-wide text-xs">
                          {order._id}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                          Logged:{" "}
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-NG",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "N/A"}
                        </span>
                      </td>

                      {/* Order Status Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize transition-colors ${
                            order.orderStatus?.toLowerCase() === "delivered"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : order.orderStatus?.toLowerCase() === "shipped"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : order.orderStatus?.toLowerCase() ===
                                      "cancelled" ||
                                    order.orderStatus?.toLowerCase() ===
                                      "canceled"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {order.orderStatus || "processing"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900 font-mono">
                        ₦
                        {order.totalPrice
                          ? order.totalPrice.toLocaleString("en-NG")
                          : 0}
                      </td>

                      <td className="px-6 py-4 text-gray-500 font-mono text-xs pl-12">
                        {itemsCount} {itemsCount === 1 ? "item" : "items"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit / Update Order Status"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Cancel Order Record"
                            onClick={() => handleDelete(order._id)}
                            disabled={
                              isThisOrderDeleting ||
                              order.orderStatus?.toLowerCase() === "cancelled"
                            }
                          >
                            {isThisOrderDeleting ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 bg-gray-50/50 p-4">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
