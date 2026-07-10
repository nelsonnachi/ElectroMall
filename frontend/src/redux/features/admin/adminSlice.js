import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminProducts, createProduct } from "./adminAPI";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    success: false,
    loading: false,
    error: null
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },

  },
  extraReducers: (builder) => {
    builder
      // Fetch Admin Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true,
        state.error = null
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while fetching the products";
      })
 
      // Create Products
      .addCase(createProduct.pending, (state) => {
        state.loading = true,
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.products.push(action.payload.product)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while creating the products";
      })
 
  },
});

export const {
    removeErrors, removeSuccess
} = adminSlice.actions;
export default adminSlice.reducer;
