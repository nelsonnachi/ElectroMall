import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register User API
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({id, quantity}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/product/${id}`);
      const productData = response.data.product;
       return {
        product: productData._id,
        name: productData.name,
        price: productData.price,
        image: productData.image?.[0]?.url || "", 
        stock: productData.stock,
        quantity, 
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while adding item to cart.",
      );
    }
  },
);