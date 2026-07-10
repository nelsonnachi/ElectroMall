import { createSlice } from "@reduxjs/toolkit";
import { createReview, getProduct, getProductDetails } from "./productAPI";

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
    reviewSuccess: false,
    reviewLoading: false,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.reviewSuccess = false;
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

    // Create review
      .addCase(createReview.pending, (state)=> {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.error = null;
        state.reviewSuccess = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error =
          action.payload?.message || action.payload ||
          "Something went wrong while creating the review.";
      })
  },
});

export const { removeErrors, removeSuccess } = productSlice.actions;
export default productSlice.reducer;
