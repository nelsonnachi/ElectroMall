import React, { useState } from "react";
import { Edit, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AllOrders = () => {
  // Hardcoded dynamic mock data structure for state representation
  const [orders, setOrders] = useState([
    {
      _id: "ORD-92841-NG",
      status: "processing",
      totalPrice: 125000,
      numberOfItems: 3,
      createdAt: "2026-07-10T14:32:00.000Z",
    },
    {
      _id: "ORD-51034-NG",
      status: "processing",
      totalPrice: 45000,
      numberOfItems: 1,
      createdAt: "2026-07-12T09:15:00.000Z",
    },
    {
      _id: "ORD-77621-NG",
      status: "processing",
      totalPrice: 380000,
      numberOfItems: 5,
      createdAt: "2026-07-13T11:04:00.000Z",
    },
  ]);

  const handleDelete = (orderId) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete order ${orderId}?`,
    );
    if (!isConfirmed) return;

    // Local filtering mutation updates interface instantaneously
    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    toast.success("Order record cleared from panel successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header Section Component Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Order Management
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor transaction volumes, track processing states, and manage client fulfillments.
          </p>
        </div>
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
                /* Empty Dataset Response Structure Layout */
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
                        Your transaction sales log is currently empty.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Serial Number Row */}
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                        {index + 1}
                      </td>

                      {/* Unique Order Identifier */}
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-bold font-mono tracking-wide text-xs">
                          {order._id}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                          Logged: {new Date(order.createdAt).toLocaleDateString("en-NG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Default Processing Status Badge */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200 capitalize">
                          {order.status}
                        </span>
                      </td>

                      {/* Currency Localized Total Price */}
                      <td className="px-6 py-4 font-semibold text-gray-900 font-mono">
                        ₦{order.totalPrice ? order.totalPrice.toLocaleString("en-NG") : 0}
                      </td>

                      {/* Quantity Metric */}
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs pl-12">
                        {order.numberOfItems} {order.numberOfItems === 1 ? "item" : "items"}
                      </td>

                      {/* Actions Operations Cell */}
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
                            onClick={() => handleDelete(order._id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
};

export default AllOrders;
