import { createSlice } from "@reduxjs/toolkit";
import { loadUserData, LoginUser, logout, registerUser, updateProfile } from "./userAPI";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
    message: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registeration cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        state.success = action.payload?.success;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false ;
      })

      // Login cases
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        state.success = action.payload?.success;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false ;
      })

      // Loading User Detail/Profile
      .addCase(loadUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load user profile. Please try again later.";
        state.user = null;
        state.isAuthenticated = false ;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user =  null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to logout";
      })

      // Update User Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = {
          ...state.user,
          ...action.payload?.user,
        };
        state.success =  action.payload?.success;
        state.message =  action.payload?.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Profile update failed. Please try again later.";
      })
  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
