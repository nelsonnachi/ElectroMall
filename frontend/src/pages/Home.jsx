import React, { useEffect } from "react";
import Banner from "../components/Banner";
import Trending from "../components/product/Trending";
import WaveLoader from "../components/WaveLoader";
import { useSelector, useDispatch } from "react-redux";
import { getProduct } from "../redux/features/product/productAPI";
import { removeErrors } from "../redux/features/product/productSlice";

import { toast } from "react-toastify";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProduct({ limit: 8 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error || "Something went wrong");
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <div>
      <Banner />
      {loading ? (
        <WaveLoader />
      ) : error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : (
        <Trending products={products} />
      )}
    </div>
  );
};

export default Home;
