import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/user/userAPI";
import { toast } from "react-toastify";

const UserDashOptions = ({ user, closeDropdown }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

   // Check if the current browser window path starts with admin routing paths
  const isAdminPanel = location.pathname.startsWith("/admin");

  const options = [
    { name: "Orders", path: "/my/orders" },
    { name: "Account", path: "/profile" },
    { name: "Logout", path: "/logout" },
  ];

    const handleButtonClick = async (item) => {
    // Always close the navigation dropdown view box immediately
    closeDropdown();

    if (item.name === "Logout") {
      try {
        await dispatch(logout()).unwrap();
        toast.success("Logged out successfully.");
        navigate("/"); // Moves authenticated user to home page safely
      } catch (error) {
        toast.error(error || "Logout failed. Please try again.");
      }
    } else {
      navigate(item.path);
    }
  };


  // Conditional rendering based on user role and dashboard location context
  if (user && user.role === "admin") {
    if (isAdminPanel) {
      options.unshift({
        name: "Home",
        path: "/",
      });
    } else {
      options.unshift({
        name: "Admin Dashboard",
        path: "/admin/dashboard",
      });
    }
  }


  return (
    <div className="flex flex-col w-full">
      {/* Header Account Info Segment */}
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex flex-col">
        <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
          Signed in as
        </span>
        <span className="text-sm font-semibold text-neutral-800 truncate mt-0.5">
          {user?.name || "User"}
        </span>
        <span className="text-xs text-neutral-500 truncate">{user?.email}</span>
      </div>

      {/* Interactive Options list */}
      <div className="py-1.5 flex flex-col w-full">
        {options.map((item, index) => (
          <button
            key={index}
            // Pass the whole 'item' object instead of just the path string
            onClick={() => handleButtonClick(item)}
            className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer font-medium ${
              item.name === "Logout"
                ? "text-red-600 hover:bg-red-50"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserDashOptions;
