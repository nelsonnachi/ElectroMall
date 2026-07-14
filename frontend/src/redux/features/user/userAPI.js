import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api";

// Register User API
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/v1/register", userData);
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
      const response = await API.post("/api/v1/login", userData, {
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
      const response = await API.get("/api/v1/profile", {
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
      const response = await API.post("/api/v1/logout", null, {
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
      const response = await API.put("/api/v1/profile/update", userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Profile Update error:", error);
      return rejectWithValue(
        error.response?.data || {
          message: "Profile update failed. Please try again later.",
        },
      );
    }
  },
);

// Update Password API
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await API.put(
        "/api/v1/password/update",
        passwordData,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Password update error:", error);
      return rejectWithValue(
        error.response?.data || {
          message: "Password update failed. Please try again later.",
        },
      );
    }
  },
);

// Forgot Password API
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/v1/password/forgot", emailData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      // Cleaned log string to match the recovery context instead of update
      console.error("Password recovery request error:", error);

      // Returns server error cleanly or a uniform fallback object structure
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to send reset link. Please try again.",
        },
      );
    }
  },
);

// Reset Password API
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, resetPasswordData }, { rejectWithValue }) => {
    try {
      const response = await API.post(
        `/api/v1/password/reset/${token}`,
        resetPasswordData,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Password recovery request error:", error);
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to reset password. Please try again.",
        },
      );
    }
  },
);
