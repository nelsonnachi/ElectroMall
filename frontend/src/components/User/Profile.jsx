import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Shield, Camera, Pencil, Lock } from "lucide-react";
import {
  getAvatarStyle,
  getUserInitial,
  hasCustomAvatar,
} from "../../utils/avatar";
import WaveLoader from "../WaveLoader";


const Profile = () => {
  const navigate = useNavigate();
  const { loading, user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (loading === false && isAuthenticated === false) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    return <WaveLoader />;
  }

  return (
    <>
      {loading ? (
        <WaveLoader />
      ) : (
        <div className="min-h-screen bg-neutral-50/50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Profile Banner background */}
            <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-600 w-full" />

            <div className="px-6 pb-8 sm:px-8 sm:pb-10 relative">
              {/* Profile Avatar Wrapper with Floating Badge */}
              <div className="absolute -top-14 left-6 sm:left-8 inline-block">
                <div className="relative">
                  {/* Core Avatar Sphere Container */}
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white flex items-center justify-center">
                    {hasCustomAvatar(user?.avatar) ? (
                      <img
                        src={user.avatar.url}
                        alt="User profile avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        style={getAvatarStyle(user)}
                        className="w-full h-full flex items-center justify-center text-white text-4xl font-bold tracking-wide"
                      >
                        {getUserInitial(user)}
                      </div>
                    )}
                  </div>

                  {/* Clicking the camera badge takes them straight to the profile edit route */}
                  <button
                    onClick={() => navigate("/profile/update")}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Change Profile Picture"
                  >
                    <Camera size={14} />
                  </button>
                </div>
              </div>

              {/* User Core Primary Titles Header with Top-Right Action Link */}
              <div className="pt-16 sm:flex sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    {user?.name || "User Name"}
                  </h1>
                  <p className="text-sm font-medium text-neutral-500 capitalize flex items-center gap-1.5 mt-1">
                    <Shield size={14} className="text-neutral-400" />
                    {user?.role || "User"} Account
                  </p>
                </div>

                {/* Action route link to edit the profile details */}
                <Link
                  to="/profile/update"
                  className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 hover:text-neutral-900 transition shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <Pencil size={15} />
                  <span>Edit Profile</span>
                </Link>
              </div>

              {/* Detailed Account Grid Fields Area */}
              <div className="mt-8 border-t border-neutral-100 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Field: Full Name Display */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50/50 border border-neutral-100">
                  <div className="p-2 bg-white rounded-lg shadow-xs text-neutral-600">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Full Name
                    </span>
                    <span className="text-sm font-medium text-neutral-800 mt-0.5">
                      {user?.name || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Field: Email Display */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50/50 border border-neutral-100">
                  <div className="p-2 bg-white rounded-lg shadow-xs text-neutral-600">
                    <Mail size={18} />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Email Address
                    </span>
                    <span className="text-sm font-medium text-neutral-800 mt-0.5 truncate">
                      {user?.email || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Option for Change Password positioned horizontally underneath the primary blocks */}
                <div className="sm:col-span-2 pt-2">
                  <Link
                    to="/password/update"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 cursor-pointer"
                  >
                    <Lock size={15} />
                    <span>Change Password</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
