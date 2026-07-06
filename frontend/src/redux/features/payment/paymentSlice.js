import { createSlice } from "@reduxjs/toolkit";
import { createOrder, verifyPayment } from "./paymentAPI";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    status: "idle",
    transaction: null,
    currentOrder: null,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.status = "idle";
      state.transaction = null;
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "creating-order";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "order-created";
        state.currentOrder = action.payload.order;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      
      .addCase(verifyPayment.pending, (state) => {
        state.status = "verifying-payment";
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transaction = action.payload;
        state.currentOrder = action.payload.order;
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
