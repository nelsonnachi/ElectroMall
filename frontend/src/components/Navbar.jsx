import React, { useState, useEffect } from "react";
import { Menu, X, User, ShoppingBag, ArrowRight, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import animg from "../assets/an.png";
import UserDashOptions from "./UserDashOptions";
import {
  getAvatarStyle,
  getUserInitial,
  hasCustomAvatar,
} from "../utils/avatar";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Categories", path: "/categories" },
  { name: "About Us", path: "/about-us" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideAnnouncement, setHideAnnouncement] = useState(false);
  const [email, setEmail] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    const handleScroll = () => setHideAnnouncement(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    } else {
      navigate(`/shop`);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div
        className={`w-full bg-amber-50 text-neutral-900 border-b border-amber-100 overflow-hidden transition-all duration-300 ${
          hideAnnouncement ? "max-h-0 opacity-0" : "max-h-60 opacity-100"
        }`}
      >
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={animg}
              alt="Promo"
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
            <p className="text-base font-medium text-neutral-800">
              Never miss out on our promotion or discount again.{" "}
              <span className="text-amber-700 font-bold">Stay connected!</span>
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="relative flex items-center border-b-2 border-neutral-800 pb-1.5 w-full max-w-sm"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent text-sm font-medium outline-none w-full pr-8"
            />
            <button
              type="submit"
              className="absolute right-0 text-neutral-800 hover:text-amber-700"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-5">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-neutral-800 md:hidden cursor-pointer"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand Logo */}
          <NavLink
            to="/"
            className="text-xl font-bold tracking-[0.15em] text-neutral-900"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-extrabold">
                  S
                </span>
                <span>ShopEASE</span>
              </div>
            </div>
          </NavLink>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium tracking-wide transition-colors ${
                      isActive
                        ? "text-neutral-900 underline underline-offset-4"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Action Icons Panel */}
          <div className="flex items-center gap-6 text-neutral-700">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-neutral-900 cursor-pointer"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <NavLink to="/cart" className="relative hover:text-neutral-900">
              <ShoppingBag size={20} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-medium text-white">
                2
              </span>
            </NavLink>

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
        </div>

        {/* ADDED: Mobile Navigation Drawer Links Menu Panel */}
        <div
          className={`md:hidden bg-white border-b border-neutral-100 transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <ul className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block text-base font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 font-semibold"
                        : "text-neutral-600"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Dropdown Search Box panel */}
        <div
          className={`w-full bg-neutral-50 border-b border-neutral-200 transition-all duration-300 overflow-hidden ${
            isSearchOpen
              ? "max-h-24 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="container mx-auto px-6 py-4">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center max-w-2xl mx-auto bg-white border border-neutral-200 rounded-lg pl-4 pr-1 py-1"
            >
              <Search size={16} className="text-neutral-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none text-neutral-900 py-1.5"
              />
              <button type="submit" className="hidden">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
