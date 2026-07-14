import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUserProfile,
  getAllOrders,
  deleteOrder,
  updateOrderStatus,
} from "./adminAPI";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    success: false,
    loading: false,
    error: null,
    product: {},
    deleting: {},
    users: [],
    user: {},
    message: null,
    orders: [],
    totalAmount: 0,
     totalPages: 1,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Admin Products
      .addCase(fetchAdminProducts.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while fetching the products";
      })

      // Create Products
      .addCase(createProduct.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.products.push(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while creating the products";
      })

      // Update Products
      .addCase(updateProduct.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.product = action.payload.product;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while updating the products";
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload.productId,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        const productId = action.meta.arg;
        if (productId) {
          state.deleting[productId] = false;
        }
        state.error =
          action.payload || "An error occurred while deleting the products";
      })

      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch all users";
      })

      //Get single user
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch single user";
      })

      //Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user role";
      })

      //Delete user profile
      .addCase(deleteUserProfile.pending, (state, action) => {
        const userId = action.meta.arg;
        state.deleting[userId] = true;
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state, action) => {
        const userId = action.meta.arg;
        state.deleting[userId] = false;
        state.message =
          action.payload.message || "User profile deleted successfully";
        state.users = state.users.filter((user) => user._id !== userId);
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        const userId = action.meta.arg;
        if (userId) {
          state.deleting[userId] = false;
        }
        state.error = action.payload || "Failed to delete user profile";
      })

      // Get all orders
      .addCase(getAllOrders.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get all user orders";
      })

      // Delete Orders 
      .addCase(deleteOrder.pending, (state, action) => {
        const orderId = action.meta.arg;
        state.deleting[orderId] = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const orderId = action.meta.arg;
        state.deleting[orderId] = false;
        state.success = action.payload.success;
        state.message =
          action.payload.message || "Order cancelled successfully";

        // 🚀 UPDATE STEPS: Find the order in memory and change its status to Cancelled
        const targetOrder = state.orders.find((order) => order._id === orderId);
        if (targetOrder) {
          targetOrder.orderStatus = "Cancelled";
        }
      })

      .addCase(deleteOrder.rejected, (state, action) => {
        const orderId = action.meta.arg;
        if (orderId) {
          state.deleting[orderId] = false;
        }
        state.error = action.payload || "Failed to delete user order";
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.order = action.payload.order;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update order";
      })

  },
});

export const { removeErrors, removeSuccess, clearMessage } = adminSlice.actions;
export default adminSlice.reducer;
