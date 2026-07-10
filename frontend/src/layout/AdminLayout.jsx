import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Users,
  ShoppingBag,
  Star,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
  Bell,
  Layers,
  PackageCheck,
  PackageX,
  DollarSign,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import UserDashOptions from "../components/User/UserDashOptions";
import {
  getAvatarStyle,
  getUserInitial,
  hasCustomAvatar,
} from "../utils/avatar";

const adminLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // Mobile sidebar open/closed state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Track open state for each individual dropdown menu
  const [openDropdown, setOpenDropdown] = useState({
    products: false,
    users: false,
    orders: false,
    reviews: false,
  });

  // Toggle utility for submenus
  const toggleDropdown = (menu) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Toggle sidebar navigation overlay on mobile screen widths
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800">
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Responsive Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-gray-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header Brand Identity */}
        <div className="flex items-center justify-between px-6 h-16 bg-slate-950 text-white font-bold text-xl border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>AdminPanel</span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collapsible Sidebar Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {/* Dashboard */}
          <div>
            <Link
              to="/admin/dashboard"
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span>Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Products Collapsible Link */}
          <div>
            <button
              onClick={() => toggleDropdown("products")}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Box className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span>Products</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown.products ? "rotate-180" : ""}`}
              />
            </button>
            {openDropdown.products && (
              <div className="pl-11 pr-4 py-2 space-y-1 bg-slate-950/40 rounded-lg mt-1 transition-all duration-200">
                <Link
                  to="/admin/products"
                  className="block py-2 text-sm text-gray-400 hover:text-white"
                   onClick={() => setIsSidebarOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  to="/admin/product/create"
                  className="block py-2 text-sm text-gray-400 hover:text-white"
                   onClick={() => setIsSidebarOpen(false)}
                >
                  Create Product
                </Link>
              </div>
            )}
          </div>

          {/* Users Collapsible Link */}
          <div>
            <button
              onClick={() => toggleDropdown("users")}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span>Users</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown.users ? "rotate-180" : ""}`}
              />
            </button>
            {openDropdown.users && (
              <div className="pl-11 pr-4 py-2 space-y-1 bg-slate-950/40 rounded-lg mt-1">
                <Link
                  to="/admin/users"
                  className="block py-2 text-sm text-gray-400 hover:text-white"
                   onClick={() => setIsSidebarOpen(false)}
                >
                  All Users
                </Link>
              </div>
            )}
          </div>

          {/* Orders Collapsible Link */}
          <div>
            <button
              onClick={() => toggleDropdown("orders")}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span>Orders</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown.orders ? "rotate-180" : ""}`}
              />
            </button>
            {openDropdown.orders && (
              <div className="pl-11 pr-4 py-2 space-y-1 bg-slate-950/40 rounded-lg mt-1">
                <Link
                  to="/admin/orders"
                  className="block py-2 text-sm text-gray-400 hover:text-white"
                   onClick={() => setIsSidebarOpen(false)}
                >
                  All Orders
                </Link>
              </div>
            )}
          </div>

          {/* Reviews Collapsible Link */}
          <div>
            <button
              onClick={() => toggleDropdown("reviews")}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span>Reviews</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openDropdown.reviews ? "rotate-180" : ""}`}
              />
            </button>
            {openDropdown.reviews && (
              <div className="pl-11 pr-4 py-2 space-y-1 bg-slate-950/40 rounded-lg mt-1">
                <Link
                  to="/admin/reviews"
                  className="block py-2 text-sm text-gray-400 hover:text-white"
                   onClick={() => setIsSidebarOpen(false)}
                >
                  All Reviews
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Primary Workspace Viewport Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Universal Top Header Bar */}
        <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-200 shadow-sm shrink-0">
          <div className="flex items-center">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden mr-4"
              onClick={toggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              Dashboard Overview
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            {/* Profiles Dropdown conditional UI logic */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={
                    hasCustomAvatar(user?.avatar)
                      ? undefined
                      : getAvatarStyle(user)
                  }
                  className="w-7 h-7 hover:opacity-90 text-white rounded-full flex items-center justify-center font-bold text-sm tracking-wide transition-all shadow-sm focus:outline-none overflow-hidden cursor-pointer"
                >
                  {hasCustomAvatar(user?.avatar) ? (
                    <img
                      src={user?.avatar?.url}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getUserInitial(user)
                  )}
                </button>

                {/* Overlay layer box trigger */}
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-neutral-100 rounded-xl shadow-xl z-50 overflow-hidden">
                      <UserDashOptions
                        user={user}
                        closeDropdown={() => setShowProfileMenu(false)}
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="hover:text-neutral-900">
                <User size={20} />
              </NavLink>
            )}
          </div>
        </header>

        {/* Scrollable View Content Canvas */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default adminLayout;
