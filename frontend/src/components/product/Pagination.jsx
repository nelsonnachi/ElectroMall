import React from "react";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalPages }) => {
  // --STATE & URL TRACKING ---
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = searchParams.get("page");
  const currentPage = pageFromUrl ? Number(pageFromUrl) : 1;

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (pageNumber) => {
    searchParams.set("page", String(pageNumber));
    setSearchParams(searchParams);
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // --- 4. DATA STRUCTURING ---
  const pageNumbers = Array.from({ length: totalPages }, function (_, index) {
    return index + 1;
  });

  // --- 5. COMPONENT INTERFACE (UI) ---
  return (
    <div className="flex items-center justify-center gap-1.5 my-12 select-none">
      {/* PREVIOUS PAGE TRIGGER */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={handlePreviousClick}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:cursor-not-allowed"
        aria-label="Go to previous page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* NUMERIC PAGE NAVIGATION LIST */}
      <div className="flex items-center gap-1.5">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={function () {
              handlePageChange(pageNumber);
            }}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
              pageNumber === currentPage
                ? "bg-black text-white font-bold shadow-md shadow-black/10 scale-105 border border-black"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900 shadow-sm"
            }`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
            aria-label={`Go to page ${pageNumber}`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* NEXT PAGE TRIGGER */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={handleNextClick}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:cursor-not-allowed"
        aria-label="Go to next page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
