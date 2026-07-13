import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle, User } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getSingleUser, updateUserRole } from "../../redux/features/admin/adminAPI";
import WaveLoader from "../WaveLoader";
import { removeErrors, removeSuccess } from "../../redux/features/admin/adminSlice";

const UpdateRole = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, success, loading, error } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const { name, email, role } = formData;

  useEffect(() => {
    if (userId) {
      dispatch(getSingleUser(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleRoleChange = (newRole) => {
    setFormData((prev) => ({ ...prev, role: newRole }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserRole({ userId, role }));
  };

  useEffect(() => {
    if (success) {
      toast.success("User role updated successfully!");
      dispatch(removeSuccess()); 
      navigate("/admin/users");  
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "An unexpected error occurred.");
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  if (loading) return <WaveLoader />;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error?.message || error}</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Navigation Header Back Bar */}
      <div className="flex items-center space-x-3">
        <Link
          to="/admin/users"
          className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Update User Role
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Modify structural privileges and system authorization access roles.
          </p>
        </div>
      </div>

      {/* Main Account Overview & Form Panel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
        
        {/* Dynamic User Target Profile Detail Card */}
        <div className="p-6 bg-gray-50/50 flex items-start space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <User className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider select-none">
              Target User Profile
            </p>
            <h3 className="text-base font-bold text-gray-900 truncate">
              {name || "Loading name..."}
            </h3>
            <p className="text-sm text-gray-500 font-mono truncate">
              {email || "Loading email..."}
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border bg-gray-100 text-gray-600 border-gray-200 uppercase mt-1">
              ID: {userId}
            </span>
          </div>
        </div>

        {/* Input Interactive Assignment Submission Area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Select Permissions Authorization Assignment
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: Standard Regular User Card */}
              <label
                className={`relative flex p-4 border rounded-xl cursor-pointer focus:outline-none transition-all select-none ${
                  role === "user"
                    ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600"
                    : "border-gray-200 hover:bg-gray-50/50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="sr-only"
                />
                <div className="flex w-full items-start justify-between">
                  <div className="space-y-1 pr-2">
                    <p className="text-sm font-bold text-gray-900">User Role</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Standard account privileges. Access limited strictly to storefront consumer operations panels.
                    </p>
                  </div>
                  {role === "user" && <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />}
                </div>
              </label>

              {/* Option 2: Full System Admin Card */}
              <label
                className={`relative flex p-4 border rounded-xl cursor-pointer focus:outline-none transition-all select-none ${
                  role === "admin"
                    ? "border-purple-600 bg-purple-50/30 ring-1 ring-purple-600"
                    : "border-gray-200 hover:bg-gray-50/50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="sr-only"
                />
                <div className="flex w-full items-start justify-between">
                  <div className="space-y-1 pr-2">
                    <p className="text-sm font-bold text-gray-900">Admin Role</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Elevated management access. Can create/delete products and update configuration metadata settings.
                    </p>
                  </div>
                  {role === "admin" && <CheckCircle className="w-5 h-5 text-purple-600 shrink-0" />}
                </div>
              </label>

            </div>
          </div>

          {/* Form Action Controls Execution Footers Row */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <Link
              to="/admin/users"
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={user?.role === role}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Save System Role Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRole;
