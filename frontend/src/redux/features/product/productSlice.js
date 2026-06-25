import { createSlice } from "@reduxjs/toolkit";
import { getProduct, getProductDetails } from "./productAPI";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
    product: null,
    resultsPerPage: 2,
    totalPages: 0,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    // getProduct
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload?.products || [];
        state.productCount = action.payload?.productCount || 0;
        state.totalPages = action.payload?.totalPages || 0;
        state.resultsPerPage = action.payload?.resultsPerPage || 10;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || action.payload ||
          "Something went wrong while fetching the product.";
      })

    // getProductDetails
      .addCase(getProductDetails.pending, (state)=> {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload?.product || null;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || action.payload ||
          "Something went wrong while fetching the product.";
      })
  },
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;
