import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { createProduct } from "../../redux/features/admin/adminAPI";
import {
  removeErrors,
  removeSuccess,
} from "../../redux/features/admin/adminSlice";

const CreateProduct = () => {
  // Relying entirely on Redux state for loading status
  const { success, error, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("Maximum upload capacity is 5 images total.");
      return;
    }

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Maximum size limit is 2MB.`);
        return;
      }

      setImages((prev) => [...prev, file]);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreviews((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    try {
      const productFormData = new FormData();

      productFormData.append("name", name);
      productFormData.append("description", description);
      productFormData.append("price", Number(price));
      productFormData.append("stock", Number(stock));
      productFormData.append("brand", brand);
      productFormData.append("category", category);

      images.forEach((file) => {
        productFormData.append("images", file);
      });

      dispatch(createProduct(productFormData));
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
      toast.success("Product created successfully!");
      dispatch(removeSuccess());

      // Reset form fields cleanly upon verified server action completion
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setBrand("");
      setImages([]);
      setImagePreviews([]);
    }
  }, [dispatch, error, success]);

  return (
    <div className="min-h-screen bg-neutral-50/50 px-4 sm:px-6 lg:px-8">
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
            Create New Product
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Avatar-Styled Multi-Product Image Row */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex flex-wrap justify-center gap-3 items-center">
              {/* Image Previews Map Rendering */}
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

              {/* Main Avatar Picker Widget (Always available if under 5 images) */}
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
            <span className="text-xs text-neutral-400 font-medium text-center">
              Click camera icon to add photos. Hover over thumbnails to delete
              them.
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
              placeholder="e.g. Inverter Split Unit Air Conditioner"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition"
            />
          </div>

          {/* Form Field: Description Textarea */}
          <div className="space-y-1.5">
            <label
              htmlFor="desc-input"
              className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"
            >
              <FileText size={14} /> Description
            </label>
            <textarea
              id="desc-input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary detailing your product..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition resize-none"
            />
          </div>

          {/* Grid Container for Price and Stock fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Form Field: Price Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="price-input"
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5"
              >
                <DollarSign size={14} /> Price (₦)
              </label>
              <input
                type="number"
                id="price-input"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition"
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
                  <span>Creating Product...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Create</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
