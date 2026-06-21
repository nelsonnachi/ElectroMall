import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "./layout/UserLayout";
import Home from "./pages/Home";

//Import Toastify components and CSS styles
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./components/ProductDetails";
import Profile from "./components/Profile";
import Shop from "./pages/Shop";
import Register from "./components/Register";
import Login from "./components/Login";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUserData } from "./redux/features/user/userAPI";
import UserDashOptions from "./components/UserDashOptions";
import EditProfile from "./components/EditProfile";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />}  />
          <Route path="/profile/update" element={<ProtectedRoute element={<EditProfile />} />}  />

          {/* <Route path="/profile/update" element={<EditProfile />} /> */}
          {/* <Route path="/password/update" element={<ChangePassword />} /> */}
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
