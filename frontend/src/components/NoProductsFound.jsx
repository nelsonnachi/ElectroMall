import React from "react";
import { SearchX, ArrowRight } from "lucide-react";

const NoProductsFound = ({ setSearchParams }) => {
  // Clears all filters and resets to show all products
  const handleViewAll = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-100 w-full px-6 py-12 text-center bg-transparent overflow-hidden select-none">
      {/* --- ARTISTIC RINGS (Subtle vector background) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-95 h-95 pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-gray-100/70 scale-100" />
        <div className="absolute inset-8 rounded-full border border-dashed border-gray-100 scale-75" />
      </div>

      {/* --- CENTERED CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto">
        <div className="relative flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-blue-50/60 text-blue-600">
          <SearchX className="w-7 h-7 stroke-[1.5]" />

          {/* Subtle outer ping animation element for interactivity */}
          <span className="absolute inline-flex h-full w-full rounded-2xl bg-blue-400 opacity-10 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
          No Results Found
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-6 px-2">
          We couldn't match your filters with any catalog items. Reset
          parameters to view all active product listings.
        </p>

        <button
          onClick={handleViewAll}
          className="group relative inline-flex items-center justify-center px-6 py-3 font-semibold text-sm text-black bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 active:scale-[0.97]"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-4 h-4 ml-2 stroke-[2.5] transform transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default NoProductsFound;
