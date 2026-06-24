import React, { useState, useEffect } from "react"; // 1. FIXED: Added missing useEffect import
import { Link, useParams, useNavigate } from "react-router-dom"; // 2. FIXED: Added missing useNavigate import
import { ArrowLeft, Save, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword } from "../../redux/features/user/userAPI";
import {
  removeErrors,
  removeSuccess,
} from "../../redux/features/user/userSlice";

const ResetPassword = () => {
  // Destructures core loading tracking and state fields directly from user slice
  const { success, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  // 3. FIXED: Removed 'const loading = false;' entirely since 'loading' is already retrieved above from Redux

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    const resetPasswordData = {
      password,
      confirmPassword,
    };

    dispatch(resetPassword({ token, resetPasswordData }));
  };

  useEffect(() => {
    if (success) {
      toast.success(success?.message || "Password reset successfully!");
      dispatch(removeSuccess());
      navigate("/login");
    }

    if (error) {
      toast.error(error?.message || "An unexpected error occurred.");
      dispatch(removeErrors());
    }
  }, [success, error, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-100/70 border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
        {/* Header Ribbon Frame */}
        <div className="relative px-6 py-8 bg-linear-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex items-center gap-4">
            <Link
              to="/login"
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              title="Return to Login"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs font-medium text-blue-100/90 mt-0.5">
                Establish new security access credentials for your account
              </p>
            </div>
          </div>
        </div>

        {/* Form Body Fields Wrapping container */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Form Field: Password */}
          <div className="space-y-2">
            <label
              htmlFor="password-input"
              className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block"
            >
              Password
            </label>
            <div className="relative flex items-center group">
              <Lock
                size={16}
                className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200 pointer-events-none"
              />
              <input
                type={showNew ? "text" : "password"}
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-11 pr-12 py-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-200/80 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                disabled={loading}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:pointer-events-none"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Form Field: Confirm New Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirm-password-input"
              className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block"
            >
              Confirm New Password
            </label>
            <div className="relative flex items-center group">
              <Lock
                size={16}
                className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200 pointer-events-none"
              />
              <input
                type={showConfirm ? "text" : "password"}
                id="confirm-password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-11 pr-12 py-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-200/80 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                disabled={loading}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:pointer-events-none"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3.5 border-t border-slate-100">
            <Link
              to="/login"
              className="px-6 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50/80 hover:border-slate-300 active:scale-98 transition-all duration-200 text-center"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-98 transition-all duration-200 disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
