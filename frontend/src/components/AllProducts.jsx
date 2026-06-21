import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SlidersHorizontal, ChevronDown, X, Grid, ListFilter } from "lucide-react";
import ProductCard from "./ProductCard";
import NoProductsFound from "./NoProductsFound";

const AllProducts = ({ searchParams, setSearchParams }) => {
  const { products } = useSelector((state) => state.product);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read URL active filter configurations
  const activeCategory = searchParams.get("category") || "";
  const activeBrand = searchParams.get("brand") || "";
  const activeSort = searchParams.get("sort") || "";

  const categories = ["Laptop", "Mobile", "TV", "AC", "Fridge", "Washing Machine", "Headphones", "Camera", "Smartwatch", "Speaker"];
  const brands = ["Apple", "Samsung", "Sony", "LG", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft"];

  // Mapping readable labels for technical sort values
  const sortLabels = {
    "": "Featured",
    "price_asc": "Price: Low to High",
    "price_desc": "Price: High to Low",
    "newest": "Newest Arrivals"
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Reusable inner filter panel configured with scrolling limits
  const FilterSections = () => (
    <div className="space-y-8">
      {/* CATEGORIES SECTION */}
      <div>
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">Categories</h3>
          {activeCategory && (
            <button 
              onClick={() => { handleFilterChange("category", ""); setIsMobileFilterOpen(false); }} 
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition"
            >
              Clear
            </button>
          )}
        </div>
        {/* Custom scroll container with refined layout variables across viewport breakpoints */}
        <div className="flex flex-wrap gap-2 md:flex-col md:gap-0 md:space-y-1 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
          {categories.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => { handleFilterChange("category", category); setIsMobileFilterOpen(false); }}
                className={`text-sm text-left transition-all ${
                  isSelected 
                    ? "bg-blue-50 text-blue-600 font-bold px-3 py-1.5 md:px-3 md:py-2 rounded-xl w-auto md:w-full" 
                    : "text-gray-600 hover:text-blue-500 bg-gray-50 md:bg-transparent px-3 py-1.5 md:px-2 md:py-2 rounded-lg w-auto md:w-full"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* BRANDS SECTION */}
      <div>
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">Brands</h3>
          {activeBrand && (
            <button 
              onClick={() => { handleFilterChange("brand", ""); setIsMobileFilterOpen(false); }} 
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition"
            >
              Clear
            </button>
          )}
        </div>
        {/* Custom scroll container matching categories layout constraints */}
        <div className="flex flex-wrap gap-2 md:flex-col md:gap-0 md:space-y-1 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
          {brands.map((brand) => {
            const isSelected = activeBrand === brand;
            return (
              <button
                key={brand}
                onClick={() => { handleFilterChange("brand", brand); setIsMobileFilterOpen(false); }}
                className={`text-sm text-left transition-all ${
                  isSelected 
                    ? "bg-blue-50 text-blue-600 font-bold px-3 py-1.5 md:px-3 md:py-2 rounded-xl w-auto md:w-full" 
                    : "text-gray-600 hover:text-blue-500 bg-gray-50 md:bg-transparent px-3 py-1.5 md:px-2 md:py-2 rounded-lg w-auto md:w-full"
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen text-gray-800 antialiased selection:bg-blue-500 selection:text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- HEADER CONTROL BAR --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
              <Grid className="w-6 h-6 text-blue-600" />
              Store Catalog
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Showing {products?.length || 0} product listings available
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Mobile Filter Toggle Trigger Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl font-medium text-sm text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.98] transition"
            >
              <ListFilter className="w-4 h-4 text-gray-500" />
              <span>Filters</span>
            </button>

            {/* Custom Styled Responsive Sort Selector */}
            <div className="relative inline-flex items-center w-1/2 sm:w-auto">
              <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase text-gray-400 mr-3">Sort:</span>
              <div className="relative w-full">
                <select
                  value={activeSort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all"
                >
                  <option value="">{sortLabels[""]}</option>
                  <option value="price_asc">{sortLabels["price_asc"]}</option>
                  <option value="price_desc">{sortLabels["price_desc"]}</option>
                  <option value="newest">{sortLabels["newest"]}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN DISPLAY AREA --- */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- DESKTOP SIDEBAR FILTER PANELS --- */}
          <aside className="hidden md:block w-1/4 min-w-60 max-w-72.5 sticky top-6 h-fit bg-gray-50/50 rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200/50">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Refine Search</span>
            </div>
            <FilterSections />
          </aside>

          {/* --- PRODUCT GRID WRAPPER --- */}
          <main className="w-full md:w-3/4 flex-1">
            {products && products.length === 0 ? (
              <NoProductsFound setSearchParams={setSearchParams} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                {products &&
                  products.map((product) => (
                    <div key={product._id} className="transition-transform duration-300 hover:-translate-y-1">
                      <ProductCard product={product} />
                    </div>
                  ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* --- MOBILE FILTER SIDE DRAWER CANVAS --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Overlay Background dim mask */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          
          {/* Floating Canvas Side Panel */}
          <div className="relative w-full max-w-xs h-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h2 className="text-md font-bold text-gray-900">Filter Products</h2>
              </div>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1">
              <FilterSections />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllProducts;