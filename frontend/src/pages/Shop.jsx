import React, { useEffect } from "react";
import WaveLoader from "../components/WaveLoader";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"; // Changed from useLocation
import { getProduct } from "../redux/features/product/productAPI";
import { removeErrors } from "../redux/features/product/productSlice";
import { toast } from "react-toastify";
import AllProducts from "../components/AllProducts";
import Pagination from "../components/Pagination";

const Shop = () => {
  const dispatch = useDispatch();
  const { loading, error, totalPages } = useSelector((state) => state.product);
  
  // 1. Use React Router's built-in hooks for search parameters
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 2. Extract all filters from the URL
  const keyword = searchParams.get("keyword") || "";
  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "";

  // 3. Re-run the API request whenever ANY filter changes
  useEffect(() => {
    dispatch(getProduct({ keyword, page, category, brand, sort }));
  }, [dispatch, keyword, page, category, brand, sort]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error(error?.message || error || "Something went wrong");
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      {loading ? (
        <WaveLoader />
      ) : error ? (
        <div className="p-6 text-center text-red-600">
          {error?.message || error || "Something went wrong"}
        </div>
      ) : (
        <div>
          {/* 4. Pass the parameters and setter down to the UI layout */}
          <AllProducts searchParams={searchParams} setSearchParams={setSearchParams} />
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </>
  );
};

export default Shop;
