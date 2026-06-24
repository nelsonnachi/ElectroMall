import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/features/user/userAPI";
import { removeErrors, removeSuccess } from "../../redux/features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const { error, success, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    dispatch(
      registerUser({
        name: user.name,
        email: user.email,
        password: user.password,
      }),
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    } else if (success) {
      toast.success("Registration successful!");
      dispatch(removeSuccess());
      navigate("/login", { state: { registered: true } }); 
    }
  }, [error, success, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-12">
        {/* Left Side: Marketing Panel */}
        <div className="hidden lg:flex lg:col-span-5 bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-700 opacity-90 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <span className="bg-white text-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center font-extrabold">
                S
              </span>
              <span>ShopEASE</span>
            </div>
          </div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold leading-tight">
              Start your shopping journey with us.
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Discover millions of products at competitive prices, track orders
              seamlessly, and enjoy premium customer benefits.
            </p>
          </div>
          <div className="relative z-10 text-xs text-indigo-200">
            &copy; 2026 ShopSphere Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Signup Form Container */}
        <div className="col-span-12 lg:col-span-7 p-6 sm:p-10 md:p-14 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="username"
                  className="text-xs font-semibold text-slate-700 tracking-wide uppercase"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="name"
                  type="text"
                  placeholder="Username"
                  required
                  value={user.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-700 tracking-wide uppercase"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={user.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-700 tracking-wide uppercase"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={user.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow-sm transform transition-all duration-150
                ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99] cursor-pointer"
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
