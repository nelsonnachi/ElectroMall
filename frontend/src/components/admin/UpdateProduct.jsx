import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  DollarSign,
  Layers,
  Package,
  Tag,
  FileText,
  Camera,
  X,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { updateProduct } from "../../redux/features/admin/adminAPI";
import { getProductDetails } from "../../redux/features/product/productAPI";
import {
  removeErrors,
  removeSuccess,
} from "../../redux/features/admin/adminSlice";

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product } = useSelector((state) => state.product);
  const { success, error, loading } = useSelector((state) => state.admin);

  // Local Form Field States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");

  // Local Multi-Image Storage States
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    "Air Conditioner",
    "Electronics",
    "Home Appliances",
    "Smartphones",
    "Computers & Accessories",
    "Audio & Speakers",
  ];

  // Safeguard: Fetch details if page is reloaded or item mismatch occurs
  useEffect(() => {
    if (id && product?._id !== id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id, product]);

  useEffect(() => {
    if (product && product._id === id) {
      setName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setStock(product.stock || "");
      setBrand(product.brand || "");

      // Pull secure URLs from MongoDB array directly into display previews
      if (product.image && product.image.length > 0) {
        const existingUrls = product.image.map((img) => img.url);
        setImagePreviews(existingUrls);
      }
    }
  }, [product, id]);

  // 1. CHOOSE NEW IMAGES: Simply appends them to your current previews list
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (imagePreviews.length + selectedFiles.length > 5) {
      toast.error("Maximum upload capacity is 5 images total.");
      return;
    }

    selectedFiles.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Max limit is 2MB.`);
        return;
      }

      // Add the raw file block to your main images state
      setImages((prev) => [...prev, file]);

      // Add the display string url to your preview state
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreviews((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 2. REMOVE AN IMAGE: Simply removes the target item by its unique index number
  const removeImage = (indexToRemove) => {
    // Look at what we are removing from the preview window
    const targetUrl = imagePreviews[indexToRemove];

    // Remove it from your on-screen visual gallery instantly
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));

    // If it was a new local file (starts with data:), remove it from your binary uploading array too
    if (targetUrl && targetUrl.startsWith("data:")) {
      // Find all new local images that were added in this session
      const newLocalPreviews = imagePreviews.filter((url) =>
        url.startsWith("data:"),
      );
      const positionInNewImages = newLocalPreviews.indexOf(targetUrl);

      // Drop it cleanly from the binary state
      if (positionInNewImages !== -1) {
        setImages((prev) =>
          prev.filter((_, idx) => idx !== positionInNewImages),
        );
      }
    }
  };

  // 3. SUBMIT CHANGES: Gathers everything and fires it to Redux
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic text validation checks
    if (
      !name.trim() ||
      !price ||
      !description.trim() ||
      !category ||
      !stock ||
      !brand.trim()
    ) {
      toast.error("All textual fields are required.");
      return;
    }

    if (imagePreviews.length === 0) {
      toast.error("Please keep at least one product image.");
      return;
    }

    try {
      const productFormData = new FormData();

      // Load all your textual details into the box
      productFormData.append("name", name);
      productFormData.append("description", description);
      productFormData.append("price", Number(price));
      productFormData.append("stock", Number(stock));
      productFormData.append("brand", brand);
      productFormData.append("category", category);

      // Send any brand-new image files if they exist
      images.forEach((file) => {
        productFormData.append("images", file);
      });

      // Filter and send any original old images that weren't deleted by the user
      if (product?.image) {
        const remainingOldImages = product.image.filter((img) =>
          imagePreviews.includes(img.url),
        );
        productFormData.append(
          "remainingImages",
          JSON.stringify(remainingOldImages),
        );
      }

      // Ship everything to your Redux state action
      dispatch(updateProduct({ id, productData: productFormData }));
    } catch (err) {
      toast.error("An error occurred while compiling fields.");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error || "Server action execution failed.");
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Product updated successfully!");
      dispatch(removeSuccess());
      navigate("/admin/products");
    }
  }, [dispatch, error, success]);

  return (
    <div className="min-h-screen bg-neutral-50/50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-xl mx-auto bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Header Ribbon Frame */}
        <div className="px-6 py-5 bg-white border-b border-neutral-100 flex items-center gap-4">
          <Link
            to="/admin/products"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-lg font-bold text-neutral-900">
            Edit/Update Product
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Multi-Product Image Area */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex flex-wrap justify-center gap-3 items-center">
              {imagePreviews.map((previewSrc, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-neutral-100 flex items-center justify-center group"
                >
                  <img
                    src={previewSrc}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 rounded-2xl"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 5 && (
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-neutral-100 flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
                    <ImageIcon size={20} className="text-neutral-300 mb-0.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                      {imagePreviews.length}/5 Img
                    </span>
                  </div>
                  <label
                    htmlFor="product-image-picker"
                    className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-colors cursor-pointer"
                    title="Choose product images"
                  >
                    <Camera size={12} />
                  </label>
                  <input
                    type="file"
                    id="product-image-picker"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
            <span className="text-xs text-neutral-400 font-medium text-center leading-normal">
              Click camera icon to pick new files. Warning: Uploading
              replacement files overwrites old cloud items entirely.
            </span>
          </div>

          {/* Form Field: Product Name Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="name-input"
              className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Product Name
            </label>
            <input
              type="text"
              id="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
              placeholder="Product Name"
            />
          </div>

          {/* Form Row: Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="price-input"
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"
              >
                <DollarSign size={14} /> Price
              </label>
              <input
                type="number"
                id="price-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                placeholder="e.g. 99.99"
              />
            </div>

            {/* Form Field: Stock Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="stock-input"
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"
              >
                <Package size={14} /> Stock Quantity
              </label>
              <input
                type="number"
                id="stock-input"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition"
              />
            </div>
          </div>

          {/* Form Field: Brand Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="brand-input"
              className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"
            >
              <Tag size={14} /> Brand Name
            </label>
            <input
              type="text"
              id="brand-input"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Skyrun, LG, Panasonic"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition"
            />
          </div>

          {/* Form Field: Choose Category Dropdown */}
          <div className="space-y-1.5">
            <label
              htmlFor="category-select"
              className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"
            >
              <Layers size={14} /> Choose Category
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition bg-white"
            >
              <option value="" disabled hidden>
                Select category...
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Action Control Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="w-full sm:w-auto text-center px-5 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition cursor-pointer"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition disabled:bg-neutral-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <span>Updating Product...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Update</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
