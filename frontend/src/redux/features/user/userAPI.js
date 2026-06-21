import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register User API
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/register", userData);
      return response.data;
    } catch (error) {
      console.error("User registration error:", error);
      return rejectWithValue(
        error.response?.data || "Registration failed. Please try again later.",
      );
    }
  },
);

// Login User API
export const LoginUser = createAsyncThunk(
  "user/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/login", userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("User login error:", error);
      return rejectWithValue(
        error.response?.data || "Login failed. Please try again later.",
      );
    }
  },
);

// Get User Data/ Profile API
export const loadUserData = createAsyncThunk(
  "user/loadUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/profile", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Failed to load user profile. Please try again later.",
      );
    }
  },
);

// Logout API
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/logout", null, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("User login error:", error);
      return rejectWithValue(error.response?.data || "Failed to logout.");
    }
  },
);

// Update Profile API
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/v1/profile/update", userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("User login error:", error);
      return rejectWithValue(error.response?.data || {message: "Profile update failed. Please try again later."});
    }
  },
);
