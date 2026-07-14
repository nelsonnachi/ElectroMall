import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Package,
  Landmark,
  MapPin,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getOrderDetails } from "../../redux/features/order/orderAPI";
import WaveLoader from "../WaveLoader";
import { updateOrderStatus } from "../../redux/features/admin/adminAPI";
import { removeSuccess, removeErrors } from "../../redux/features/admin/adminSlice";

const UpdateOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");

  const {
    order = {},
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.order);
  const {
    loading: adminLoading,
    error: adminError,
    success,
  } = useSelector((state) => state.admin);

  const loading = orderLoading || adminLoading;

  useEffect(() => {
    dispatch(removeSuccess());
    dispatch(removeErrors());
  }, [dispatch]);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order && order.orderStatus) {
      setStatus(order.orderStatus);
    }
  }, [order]);

  useEffect(() => {
    const errorPayload = orderError || adminError;
    if (errorPayload) {
      toast.error(
        errorPayload?.message || typeof errorPayload === "string"
          ? errorPayload
          : "An unexpected error occurred."
      );
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Order status updated successfully!");
      dispatch(removeSuccess()); 
      navigate("/admin/orders");  
    }
  }, [orderError, adminError, success, dispatch, navigate]);

  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
  } = order;
  const currentStatus = orderStatus?.toLowerCase() || "processing";

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!orderId || !status) return;

    dispatch(updateOrderStatus({ orderId, status }));
  };

  if (orderLoading) return <WaveLoader />;


  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Back Navigation Top Bar */}
      <div className="flex items-center space-x-3">
        <Link
          to="/admin/orders"
          className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Order Fulfillment Operations
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Process invoices, review item metrics, and authorize transaction
            updates.
          </p>
        </div>
      </div>

      {/* =========================================================================
          SEGMENT 1: ORDER INFORMATION (TABULAR DATA CARD)
          ========================================================================= */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider select-none">
            1. Order Information
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase">
                Order ID
              </span>
              <span className="font-mono text-xs font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded border inline-block mt-1">
                {orderId}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase">
                Shipping Address Destination
              </span>
              <p className="text-gray-700 font-medium mt-1 leading-relaxed">
                {`${shippingInfo.address || ""}, ${shippingInfo.city || ""}, ${shippingInfo.state || ""}, ${shippingInfo.postalCode || ""}`}
              </p>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase">
                Customer Contact Phone
              </span>
              <span className="text-gray-900 font-medium font-mono block mt-1">
                {shippingInfo.phoneNumber || shippingInfo.phoneNo || "N/A"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase">
                Order Status
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize mt-1.5 ${
                  currentStatus === "delivered"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : currentStatus === "shipped"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : currentStatus === "cancelled" ||
                          currentStatus === "canceled"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {orderStatus || "processing"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase">
                Payment Status
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${
                  paymentInfo?.status === "success" ||
                  paymentInfo?.status === "paid"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                    : "bg-amber-50 text-amber-700 border-amber-200/60"
                }`}
              >
                {paymentInfo?.status === "success" ||
                paymentInfo?.status === "paid"
                  ? "Paid"
                  : "Not Paid"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase">
                Total Price
              </span>
              <span className="text-lg font-bold text-gray-900 font-mono block mt-0.5">
                ₦{totalPrice ? totalPrice.toLocaleString("en-NG") : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEGMENT 2: ORDER ITEMS TABLE GRID
          ========================================================================= */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center space-x-2">
          <Package className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider select-none">
            2. product Details
          </h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left text-sm text-gray-600 min-w-200">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 select-none">
              <tr>
                <th scope="col" className="px-6 py-3 w-16">
                  S/N
                </th>
                <th scope="col" className="px-6 py-3 w-24">
                  Image
                </th>
                <th scope="col" className="px-6 py-3">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-3 text-center w-24">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 font-mono">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white font-medium text-gray-700">
              {orderItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400 font-mono text-xs"
                  >
                    No individual line-items associated with this record.
                  </td>
                </tr>
              ) : (
                orderItems.map((item, index) => {
                  const itemImg = item.image || item.product?.image || "";
                  return (
                    <tr
                      key={item._id || index}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                          {itemImg ? (
                            <img
                              src={itemImg}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-mono">
                              No Img
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="max-w-xs md:max-w-md font-semibold text-gray-900 truncate"
                          title={item.name}
                        >
                          {item.name || "Unknown Product"}
                        </div>
                        <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                          SKU ID: {item.product?._id || item.product || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-gray-900">
                        {item.quantity || 1}
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                        ₦{item.price ? item.price.toLocaleString("en-NG") : 0}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          SEGMENT 3: INTERACTIVE DROP-DOWN SELECTION FORM AND CONTROL ROW
          ========================================================================= */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center space-x-2">
          <Landmark className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider select-none">
            3. Change Order Status
          </h3>
        </div>
        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Change Order Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={
                adminLoading ||
                currentStatus === "delivered" ||
                currentStatus === "cancelled" ||
                currentStatus === "canceled"
              }
              className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all select-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <option value="Processing">Processing </option>
              <option value="Shipped">
                Shipped 
              </option>
              <option value="Delivered">
                Delivered 
              </option>
              <option value="Cancelled">
                Cancelled 
              </option>
            </select>

            {(currentStatus === "delivered" ||
              currentStatus === "cancelled" ||
              currentStatus === "canceled") && (
              <p className="text-xs text-amber-600 font-medium mt-1 select-none">
                * Archived states are permanently immutable. Terminal pipelines
                cannot be re-opened for modification.
              </p>
            )}
          </div>

          {/* Form Action Controls Execution Footers Row */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <Link
              to="/admin/orders"
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={
                adminLoading ||
                currentStatus === status?.toLowerCase() ||
                currentStatus === "delivered" ||
                currentStatus === "cancelled" ||
                currentStatus === "canceled"
              }
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              {adminLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              <span>
                {adminLoading
                  ? "Updating..."
                  : "Update Status"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrder;
