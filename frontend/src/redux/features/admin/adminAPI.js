import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch admin products (with dynamic backend search parameters and pagination metrics)
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (filterData = {}, { rejectWithValue }) => {
    try {
      // Destructure keyword and active page strings safely, defaulting if blank
      const { keyword = "", page = 1 } = filterData;

      // Pass parameter strings directly into the API route URL string
      const url = `/api/v1/admin/products?keyword=${keyword}&page=${page}`;
      
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while fetching the products",
      );
    }
  },
);


// Create products
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/admin/product/create",
        productData,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while creating the product",
      );
    }
  },
);

// Update products
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/v1/admin/product/${id}`,
        productData,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while updating the product",
      );
    }
  },
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/product/${productId}`);
      return { productId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while deleting the product",
      );
    }
  },
);

// Fetch all users (With explicit URL parameter mapping variables support)
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (filterData = {}, { rejectWithValue }) => {
    try {
      const { page = 1 } = filterData;

      // Map parameters seamlessly into a standard URL query template literal
      const { data } = await axios.get(`/api/v1/admin/users?page=${page}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all users",
      );
    }
  },
);

// Fetch single user
export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch single user",
      );
    }
  },
);

// Update User Role
export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/user/${userId}`, {
        role,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user role",
      );
    }
  },
);

// Delete User Profile
export const deleteUserProfile = createAsyncThunk(
  "admin/deleteUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user profile ",
      );
    }
  },
);

/// Get all orders (with dynamic backend dates, filters and pagination strings)
export const getAllOrders = createAsyncThunk(
  "admin/getAllOrders",
  async (filterData = {}, { rejectWithValue }) => {
    try {
      // Destructure date parameters and current page number values safely
      const { startDate = "", endDate = "", page = 1 } = filterData;

      // Map queries cleanly into standard URL API endpoints search strings
      const url = `/api/v1/admin/orders?startDate=${startDate}&endDate=${endDate}&page=${page}`;
      
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get all users orders",
      );
    }
  },
);


// Delete Orders
export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order ",
      );
    }
  },
);

// Update Order status
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({orderId, status}, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/order/${orderId}`, {status});
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order ",
      );
    }
  },
);
