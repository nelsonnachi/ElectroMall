import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api";

// All products (function for getting all products
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (
    { keyword, page = 1, category, brand, sort, limit } = {},
    { rejectWithValue },
  ) => {
    try {
      // Create a dynamic query object
      const params = new URLSearchParams();

      if (keyword) params.append("keyword", keyword);
      if (page) params.append("page", String(page));
      if (category) params.append("category", category);
      if (brand) params.append("brand", brand);
      if (sort) params.append("sort", sort);
      if (limit) params.append("limit", String(limit));

      // Automatically formats to: /api/v1/products?keyword=...&page=...&category=...
      const link = `/api/v1/products?${params.toString()}`;

      const response = await API.get(link);
      return response.data;
    } catch (error) {
      console.error("Product fetch error:", error);
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching the product.",
      );
    }
  },
);

// Product Details (Function for getting singe product details)
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const link = `/api/v1/product/${id}`;
      const response = await API.get(link);
      return response.data;
    } catch (error) {
      console.error("Product fetch error:", error);
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching the product.",
      );
    }
  },
);

// Product Details (Function for getting singe product details)
export const createReview = createAsyncThunk(
  "product/createReview",
  async ({rating, comment, productId}, { rejectWithValue }) => {
    try {
      const {data} = await API.put(`/api/v1/review`, { rating, comment, productId });
      return data;
    } catch (error) {
      console.error("Product fetch error:", error);
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching the product.",
      );
    }
  },
);
