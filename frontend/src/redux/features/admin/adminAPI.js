import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const {data} = await axios.get('/api/v1/admin/products');
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching the products",
      );
    }
  },
);
// Create products
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const {data} = await axios.post('/api/v1/admin/product/create', productData);
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while creating the product",
      );
    }
  },
);