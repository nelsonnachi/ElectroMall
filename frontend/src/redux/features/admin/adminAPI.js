import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/products");
      return data;
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

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/users");
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

// Get all orders
export const getAllOrders = createAsyncThunk(
  "admin/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete('/api/v1/admin/orders');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get all users orders ",
      );
    }
  },
);
