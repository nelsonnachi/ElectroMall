import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api";

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async ({ reference, orderId }, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/api/payments/verify/${reference}/${orderId}`,
        {
          withCredentials: true,
        },
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);



