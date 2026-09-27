"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { IProduct } from "@/types";
import { api } from "@/lib/axios";
import { Loader2, Home as HomeIcon } from "lucide-react";

export default function HomeLivingPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomeLivingProducts = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await api.get("/products?category=home-living");
        const resData = response.data as Record<string, any>;

        // Defensive extraction to ensure array type
        const fetchedData = resData?.data || resData?.products || resData;

        if (Array.isArray(fetchedData)) {
          setProducts(fetchedData);
        } else {
          setProducts([]); // Fallback to empty array
        }
      } catch (err: unknown) {
        console.error("Error fetching Home & Living products:", err);
        setProducts([]); // Prevent crash on error response
      } finally {
        setLoading(false);
      }
    };

    fetchHomeLivingProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-gray-50 border-b border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white mb-4">
            <HomeIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
            Home & Living
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-gray-500">
            Elevate your personal space with our curated collection of luxury home essentials, décor, and lifestyle accessories.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-black mb-3" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Loading Products...
            </p>
          </div>
        ) : !Array.isArray(products) || products.length === 0 ? (
          /* Zero Products Found State */
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <HomeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">0 Products Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              We are currently updating our Home & Living stock. Check back soon for new arrivals!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Showing {products.length} Products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}