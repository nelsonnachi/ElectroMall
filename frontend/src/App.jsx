import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import Home from "./pages/Home";

//Import Toastify components and CSS styles
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./components/product/ProductDetails";
import Profile from "./components/User/Profile";
import Shop from "./pages/Shop";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUserData } from "./redux/features/user/userAPI";
import EditProfile from "./components/User/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import OrderConfirmation from "./components/cart/OrderConfirmation";
import Payment from "./components/cart/Payment";
import PaymentResult from "./components/cart/PaymentResult";
import MyOrders from "./components/order/MyOrders";
import OrderDetails from "./components/order/OrderDetails";
import Dashboard from "./components/admin/Dashboard";
import ProductsList from "./components/admin/ProductsList";
import CreateProduct from "./components/admin/CreateProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import AllUsers from "./components/admin/AllUsers";
import UpdateRole from "./components/admin/UpdateRole";

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUserData());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:keyword" element={<Shop />} />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/profile/update"
            element={<ProtectedRoute element={<EditProfile />} />}
          />
          <Route
            path="/password/update"
            element={<ProtectedRoute element={<UpdatePassword />} />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/shipping"
            element={<ProtectedRoute element={<Shipping />} />}
          />
          <Route
            path="/order/confirm"
            element={<ProtectedRoute element={<OrderConfirmation />} />}
          />
          <Route
            path="/process/payment"
            element={<ProtectedRoute element={<Payment />} />}
          />
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute element={<PaymentResult status="success" />} />
            }
          />
          <Route
            path="/payment/cancelled"
            element={
              <ProtectedRoute element={<PaymentResult status="cancelled" />} />
            }
          />
          <Route
            path="/my/orders"
            element={<ProtectedRoute element={<MyOrders />} />}
          />
          <Route
            path="/order/:id"
            element={<ProtectedRoute element={<OrderDetails />} />}
          />
        </Route>

        {/* Admin layout and routes  */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<AdminLayout />} adminOnly={true} />
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="product/create" element={<CreateProduct />} />
          <Route path="product/edit/:id" element={<UpdateProduct />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="user/:userId" element={<UpdateRole />} />
        </Route> 

        {/* Auth credentials */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
      </Routes>

      {/* Adding the container at the bottom so it is globally available */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
