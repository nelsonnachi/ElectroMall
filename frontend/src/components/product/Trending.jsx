import React from "react";
import Title from "../Title";
import ProductCard from "./ProductCard";

const Trending = ({ products = [] }) => {
  return (
    <section className="bg-slate-50/50 py-12">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Title
              text="Featured Electronics"
              level={2}
              className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
            />
            <p className="mt-1 text-sm text-slate-500">
              Explore our top picks from world-class brands.
            </p>
          </div>
          <a
            href="#all-products"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View all &rarr;
          </a>
        </div>

        {/* Responsive Layout Grid */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trending;
