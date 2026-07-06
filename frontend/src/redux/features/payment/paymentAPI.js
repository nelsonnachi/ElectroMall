import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/v1/new/order", orderData, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async ({ reference, orderId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
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
