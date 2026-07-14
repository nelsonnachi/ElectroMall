import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/product/productSlice";
import userReducer from "./features/user/userSlice";
import cartReducer from "./features/cart/cartSlice";
import paymentReducer from "./features/payment/paymentSlice";
import orderReducer from "./features/order/orderSlice";
import adminReducer from "./features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    cart: cartReducer,
    payment: paymentReducer,
    order: orderReducer,
    admin: adminReducer,
  },
  // INJECTED MIDDLEWARE CONFIGURATION TO SILENCE WARNINGS:
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
      immutableCheck: false,  
    }),
});
