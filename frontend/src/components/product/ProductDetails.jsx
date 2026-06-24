import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "./Rating";
import WaveLoader from "../WaveLoader";
import { getProductDetails } from "../../redux/features/product/productAPI";
import { removeErrors } from "../../redux/features/product/productSlice";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { product, loading, error } = useSelector((state) => state.product);

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Fetch product details from the database when the page loads
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  // Clean up errors in the Redux store when leaving this page
  useEffect(() => {
    return () => {
      dispatch(removeErrors());
    };
  }, [dispatch]);

  // Set the initial large image as soon as the product data arrives from Redux
  useEffect(() => {
    if (product?.image?.length > 0) {
      const rawUrl = product.image[0].url;
      const cleanUrl = rawUrl.startsWith("./")
        ? rawUrl.replace("./", "/")
        : rawUrl;
      setSelectedImage(cleanUrl);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("Sorry, this product is out of stock.");
      return;
    }

    toast.success(
      `${product.name} added to cart (${quantity} item${quantity > 1 ? "s" : ""})`,
    );
    setQuantity(1);
  };

  // Handle review submission form
  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (userRating === 0 || !userComment.trim()) {
      toast.error("Doing Great! Kindly Fill Both Fields.");
      return;
    }

    const reviewData = {
      rating: userRating,
      comment: userComment,
      productId: product?._id,
    };

    console.log("Review data ready for backend:", reviewData);
    toast.success("Review submitted successfully!");

    // Reset input fields
    setUserRating(0);
    setUserComment("");
  };

  // App Status Boundaries (Loading, Error, or Empty States)
  if (loading) return <WaveLoader />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center text-rose-600">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center text-slate-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 text-slate-800 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
        {/* LEFT COLUMN: Image Showcase Area */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* DYNAMIC IMAGE PICKER BOX RULE:
              Only renders if the admin uploaded more than 1 image asset */}
          {product.image && product.image.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.image.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const thumbUrl = img.url.startsWith("./")
                      ? img.url.replace("./", "/")
                      : img.url;
                    setSelectedImage(thumbUrl);
                  }}
                  className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    selectedImage ===
                    (img.url.startsWith("./")
                      ? img.url.replace("./", "/")
                      : img.url)
                      ? "border-black scale-95"
                      : "border-transparent opacity-70"
                  }`}
                >
                  <img
                    src={
                      img.url.startsWith("./")
                        ? img.url.replace("./", "/")
                        : img.url
                    }
                    alt="thumbnail"
                    className="h-16 w-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Information Details Area */}
        <div className="flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {product.brand} · {product.category}
          </span>
          <h1 className="mt-1 text-2xl md:text-3xl font-light tracking-tight text-slate-900">
            {product.name}
          </h1>

          <div className="mb-4 flex items-center gap-1 text-sm font-medium text-amber-500 md:mb-6">
            <span>★</span> <span>{product.ratings} / 5</span>
          </div>

          <p className="mb-4 text-xl md:text-2xl font-semibold text-slate-900">
            {formatPrice(product.price)}
          </p>
          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            {product.description}
          </p>

          <div className="border-t border-slate-100 pt-6">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-slate-400">Availability</span>
              <span
                className={`font-medium ${product.stock > 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} left)`
                  : "Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex gap-4">
                <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="px-3 py-2 text-slate-500 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      quantity < product.stock && setQuantity(quantity + 1)
                    }
                    className="px-3 py-2 text-slate-500 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition active:scale-[0.98]"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Layout Section: Collapsible Review Accordion Drawer Box */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100/50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between bg-slate-50/50 px-5 py-5 text-left hover:bg-slate-50 transition"
        >
          <span className="text-sm font-medium tracking-tight text-slate-900">
            Customer Reviews ({product.numOfReviews || 0})
          </span>
          <span
            className={`text-xs text-slate-400 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-375 border-t border-slate-100 p-5 md:p-6" : "max-h-0"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Split A: Reviews Display List */}
            <div className="md:col-span-2 space-y-6 order-2 md:order-1">
              {!product.reviews || product.reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                  <p className="text-sm text-slate-400">
                    No reviews yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div
                    key={review._id || review.id}
                    className="border-b border-slate-50 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">
                        {review.name}
                      </span>
                      <span className="text-xs font-medium text-amber-500">
                        ★ {review.rating}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Split B: Write a Review Form Container Block */}
            <div className="order-1 md:order-2 rounded-xl border border-slate-100 bg-slate-50 p-4 h-fit">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Write a Review
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">
                    Your Rating
                  </label>
                  <Rating
                    totalRatingsCount={product.reviews?.length || 0}
                    onRatingSelect={setUserRating}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">
                    Your Comment
                  </label>
                  <textarea
                    rows="3"
                    value={userComment}
                    onChange={(event) => setUserComment(event.target.value)}
                    placeholder="What did you like or dislike?"
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white p-2.5 text-xs focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
