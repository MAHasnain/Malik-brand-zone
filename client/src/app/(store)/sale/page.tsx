"use client";

import { useEffect, useState, useMemo } from "react";
import { IProduct } from "@/types";
import { getProducts } from "@/services/product.api";
import ProductCard from "@/components/product/ProductCard";

export default function SalePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("NEWEST");
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  useEffect(() => {
    async function fetchSaleProducts() {
      setLoading(true);
      const allProducts = await getProducts();
      
      // Filter ONLY products that have a discount price or sale tag
      const saleItems = allProducts.filter(
        (p) => p.discountPrice && p.discountPrice < p.price
      );
      
      setProducts(saleItems);
      setLoading(false);
    }
    fetchSaleProducts();
  }, []);

  // Dynamic Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const activePrice = p.discountPrice || p.price;
        const matchesPrice = activePrice <= maxPrice;
        const matchesSize =
          selectedSize === "ALL" || (p.sizes && p.sizes.includes(selectedSize));
        return matchesPrice && matchesSize;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;

        if (sortBy === "PRICE_LOW") return priceA - priceB;
        if (sortBy === "PRICE_HIGH") return priceB - priceA;
        return 0; // NEWEST (Default order)
      });
  }, [products, selectedSize, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner / Header */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 sm:p-10 mb-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-100 px-3 py-1 rounded-full">
          Limited Time Offers
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-3">
          FLAT SALE & CLEARANCE
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl mx-auto">
          Explore exclusive markdown prices on lawn suits, pret wear, and seasonal luxury collections.
        </p>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Size Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Size
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black font-semibold"
            >
              <option value="ALL">All Sizes</option>
              <option value="S">Small (S)</option>
              <option value="M">Medium (M)</option>
              <option value="L">Large (L)</option>
              <option value="XL">Extra Large (XL)</option>
              <option value="Unstitched">Unstitched</option>
            </select>
          </div>

          {/* Max Price Range */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Max Price: PKR {maxPrice.toLocaleString()}
            </label>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-black font-semibold w-full md:w-auto"
          >
            <option value="NEWEST">Newest Arrivals</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid State Handling */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg aspect-[3/4] w-full" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm font-semibold text-gray-500">No sale items match your selected filters.</p>
          <button
            onClick={() => {
              setSelectedSize("ALL");
              setMaxPrice(15000);
            }}
            className="mt-4 text-xs font-bold uppercase tracking-wider underline text-black"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}