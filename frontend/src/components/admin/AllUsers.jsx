import React, { useEffect } from "react";
import { Edit, Trash2, Plus, Users, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteUserProfile,
  fetchAllUsers,
} from "../../redux/features/admin/adminAPI";
import WaveLoader from "../WaveLoader";
import {
  clearMessage,
  removeErrors,
  removeSuccess,
} from "../../redux/features/admin/adminSlice";
import { toast } from "react-toastify";
import Pagination from "../product/Pagination";

const AllUsers = () => {
  const {
    loading,
    error,
    users = [], // 🌟 Fixed: Safeguarded array boundary fallback
    message,
    deleting,
    totalPages = 1,
  } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    dispatch(fetchAllUsers({ page }));
  }, [dispatch, page]);

  const handleDelete = (userId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!isConfirmed) return;
    dispatch(deleteUserProfile(userId));
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "An unexpected error occurred.");
      dispatch(removeErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, dispatch, message]);

  if (loading) return <WaveLoader />;
  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Dynamic Header Section Component Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            User Management
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage, monitor, and update your application user accounts and roles.
          </p>
        </div>
        <Link
          to="/admin/users/create"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
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
                <th scope="col" className="px-6 py-4">
                  Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Email
                </th>
                <th scope="col" className="px-6 py-4">
                  Role
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
              {users.length === 0 ? (
                /* Clear Empty State Message Row */
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="w-8 h-8 text-gray-300" />
                      <p className="font-semibold text-gray-500">
                        No users found
                      </p>
                      <p className="text-xs text-gray-400">
                        Your user registration database is currently empty.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const isAdmin = user.role === "admin";
                  const isRowDeleting = deleting?.[user._id];

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Serial Number Row */}
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                        {((page - 1) * 10) + (index + 1)}
                      </td>

                      {/* User Name Descriptive Identifiers */}
                      <td className="px-6 py-4">
                        <div
                          className="max-w-xs md:max-w-sm truncate text-gray-900 font-semibold"
                          title={user.name}
                        >
                          {user.name}
                        </div>
                        <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                          ID: {user._id}
                        </span>
                      </td>

                      {/* Email Field */}
                      <td className="px-6 py-4 text-gray-900 font-mono text-xs">
                        {user.email}
                      </td>

                      {/* Dynamic Role Badge Leaf Tag */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            isAdmin
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* Created At Timestamp Date */}
                      <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-NG",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </td>

                      {/* Actions Operations Cell */}
                      {/* 🌟 Fixed: Fully closed and sealed the elements layout below */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            to={`/admin/user/${user._id}`}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={isRowDeleting}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            title="Delete User"
                          >
                            {isRowDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
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

export default AllUsers;
