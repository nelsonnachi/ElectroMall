import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Users,
  ShoppingBag,
  Star,
  DollarSign,
  PackageCheck,
  PackageX,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="space-y-6">
      {/* Top Welcome Title Banner */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back, {user?.name || "Admin"}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Here is your application metric framework performance overview.
        </p>
      </div>

      {/* Quick Metrics Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-gray-800 font-mono">1,245</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Users</p>
            <p className="text-2xl font-bold text-gray-800 font-mono">32,840</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">New Orders</p>
            <p className="text-2xl font-bold text-gray-800 font-mono">452</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Avg Rating</p>
            <p className="text-2xl font-bold text-gray-800 font-mono">4.8</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Income</p>
            <p className="text-2xl font-bold text-gray-800 font-mono">₦3,000,000</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">In Stock</p>
            <p className="text-2xl font-bold text-gray-800 font-mono">4</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <PackageX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-800 font-mono">10</p>
          </div>
        </div>
      </div>

      {/* Main Visual Display Area Box Placeholder */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-64 flex items-center justify-center text-gray-400 border-dashed">
        Main content display canvas area
      </div>
    </div>
  );
}

export default Dashboard;
