import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { forgotPassword } from "../../redux/features/user/userAPI";
import { removeErrors, removeSuccess } from "../../redux/features/user/userSlice";

const ForgotPassword = () => {
  const { loading, error, success, message } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    // Simple regex check for basic email validation before hitting the API
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const emailData = {
        email
      };
      dispatch(forgotPassword(emailData));
    } catch (err) {
      toast.error(
        err?.message || "Failed to send reset link. Please try again."
      );
    }
  };

  useEffect(() => {
    if (success) {
      toast.success(message || "Password reset link sent to email successfully!");
      dispatch(removeSuccess());
      setEmail(""); 
    }

    if (error) {
      const errorMessage = typeof error === "string" ? error : error?.message;
      toast.error(errorMessage || "An unexpected error occurred.");
      dispatch(removeErrors());
    }
  }, [success, error, message, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-100/70 border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
        
        {/* Modern Premium Banner Header */}
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
              <h2 className="text-xl font-bold tracking-tight">Recovery Access</h2>
              <p className="text-xs font-medium text-blue-100/90 mt-0.5">
                Recover your account password using email
              </p>
            </div>
          </div>
        </div>

        {/* Form Body Fields Wrapping container */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 bg-white">
          <p className="text-sm text-slate-500 leading-relaxed">
            Enter the email address associated with your account. We will send you a secure link to reset your security credentials.
          </p>

          {/* Form Field: Registered Email Address */}
          <div className="space-y-2">
            <label
              htmlFor="forgot-email-input"
              className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block"
            >
              Email Address
            </label>
            <div className="relative flex items-center group">
              <Mail
                size={16}
                className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200 pointer-events-none"
              />
              <input
                type="email"
                id="forgot-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={loading}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-200/80 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
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
                  Sending Link...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Reset Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
