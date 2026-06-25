import { createSlice } from "@reduxjs/toolkit";
import { addItemsToCart } from "./cartAPI";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.product !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); 
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Items to Cart cases
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const newItem = action.payload;

        // Check if the exact product already exists in the cart list
        const isItemExist = state.cartItems.find(
          (item) => item.product === newItem.product,
        );

        if (isItemExist) {
          state.cartItems = state.cartItems.map((item) =>
            item.product === isItemExist.product ? newItem : item,
          );
        } else {
          state.cartItems.push(newItem);
        }

        // Save the updated cart array directly to local storage
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })

      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while adding item to cart.";
      });
  },
});

export const { removeErrors, removeSuccess, removeItemFromCart } = cartSlice.actions;
export default cartSlice.reducer;
