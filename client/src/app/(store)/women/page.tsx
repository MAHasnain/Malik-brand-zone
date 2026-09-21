import FilterSidebar from "@/components/product/FilterSidebar";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/product.api";
import { getAllCategories } from "@/services/category.api";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function WomenCategoryPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const categories = await getAllCategories();

  // Find 'Women' category dynamically from DB if no specific filter is active
  const womenCategory = categories.find(
    (c) => c.name.toLowerCase() === "women" || c.slug === "women"
  );

  const activeCategoryId = resolvedParams.category || womenCategory?._id;

  // Fetch real products from MongoDB
  const products = await getProducts({
    category: activeCategoryId,
    search: resolvedParams.search,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      {/* Page Header with Minimalist Luxury Styling */}
      <div className="mb-10 text-center lg:text-left border-b border-gray-100 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 block mb-1">
          Catalog
        </span>
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-gray-900 mb-2">
          Women's Collection
        </h1>
        <p className="text-gray-500 text-sm max-w-xl">
          Discover the latest arrivals in luxury lawn, silk, and unstitched pret tailored to perfection.
        </p>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 no-scrollbar">
        <Link
          href="/women"
          className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap border ${
            !resolvedParams.category
              ? "bg-black text-white border-black shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-black"
          }`}
        >
          All Women
        </Link>
        {categories.map((cat) => {
          const isActive = resolvedParams.category === cat._id;
          return (
            <Link
              key={cat._id}
              href={`/women?category=${cat._id}`}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap border ${
                isActive
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-black"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8 relative">
        {/* Left Sidebar (Filters) */}
        <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
          <FilterSidebar categories={categories} />
        </div>

        {/* Right Side (Dynamic Product Grid) */}
        <div className="flex-1 w-full">
          {/* Results Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Showing {products.length} {products.length === 1 ? "Product" : "Products"}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <h3 className="text-base font-serif font-semibold text-gray-900 mb-1">
                No items found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Try selecting a different category or clearing active filters.
              </p>
              <Link
                href="/women"
                className="inline-block bg-black text-white text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded hover:bg-gray-800 transition"
              >
                Reset Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}