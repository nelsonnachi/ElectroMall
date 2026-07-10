import React, { useEffect } from "react";
import { Edit, Trash2, Plus, Star, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminProducts } from "../../redux/features/admin/adminAPI";
import WaveLoader from "../WaveLoader";
import { removeErrors } from "../../redux/features/admin/adminSlice";

const AllProducts = () => {
  const { products, error, loading } = useSelector((state) => state.admin);
  console.log(products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "An unexpected error occurred.");
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  if (loading) return <WaveLoader />;
  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Dynamic Header Section Component Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Product Catalogue
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage, monitor, and update your application inventory store items.
          </p>
        </div>
        <Link
          to="/admin/products/create"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left text-sm text-gray-600 min-w-200">
            {/* Header Text Item Labels Panel */}
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 select-none">
              <tr>
                <th scope="col" className="px-6 py-4 w-16">
                  S/N
                </th>
                <th scope="col" className="px-6 py-4 w-24">
                  Image
                </th>
                <th scope="col" className="px-6 py-4">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Brand
                </th>
                <th scope="col" className="px-6 py-4">
                  Price
                </th>
                <th scope="col" className="px-6 py-4">
                  Rating
                </th>
                <th scope="col" className="px-6 py-4">
                  Category
                </th>
                <th scope="col" className="px-6 py-4">
                  Stock
                </th>
                <th scope="col" className="px-6 py-4">
                  Created At
                </th>
                <th scope="col" className="px-6 py-4 text-center w-28">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Dynamic Grid Mapping Table Rows List Body */}
            <tbody className="divide-y divide-gray-200 bg-white font-medium text-gray-700">
              {products.length === 0 ? (
                /* Clear Empty State Message Row */
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <PackageOpen className="w-8 h-8 text-gray-300" />
                      <p className="font-semibold text-gray-500">
                        No products found
                      </p>
                      <p className="text-xs text-gray-400">
                        Your store inventory catalogue is currently empty.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product, index) => {
                  const isOutOfStock = product.stock === 0;
                  const productImageSrc = product.image?.[0]?.url || "";

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Serial Number Row */}
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                        {index + 1}
                      </td>

                      {/* Rendered Thumbnail Box Context */}
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                          {productImageSrc ? (
                            <img
                              src={productImageSrc}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">
                              No Img
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product Descriptive Identifiers */}
                      <td className="px-6 py-4">
                        <div
                          className="max-w-xs md:max-w-sm truncate text-gray-900 font-semibold"
                          title={product.name}
                        >
                          {product.name}
                        </div>
                        <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                          ID: {product._id}
                        </span>
                      </td>

                      {/* Brand Field */}
                      <td className="px-6 py-4 text-gray-900">
                        {product.brand || "N/A"}
                      </td>

                      {/* Standardized Price Tag Values */}
                      <td className="px-6 py-4 font-semibold text-gray-900 font-mono">
                        ₦{product.price ? product.price.toLocaleString() : 0}
                      </td>

                      {/* Review Badge Grid Panel Row */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center space-x-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-bold border border-amber-100">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{(product.ratings || 0).toFixed(1)}</span>
                        </div>
                      </td>

                      {/* Product Department Leaf Tag */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {product.category}
                        </span>
                      </td>

                      {/* Stock Conditional Status Elements */}
                      <td className="px-6 py-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                            Out of Stock
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-gray-900 font-bold font-mono">
                              {product.stock}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              units left
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Timestamp Formatting Values */}
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </td>

                      {/* Action Trigger Controls Pane */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Link>
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

export default AllProducts;
