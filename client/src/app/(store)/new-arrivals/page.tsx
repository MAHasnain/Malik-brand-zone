import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/product.api";
import Link from "next/link";

export default async function NewArrivalsPage() {
  const products = await getProducts({ limit: 16 });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-16">
      {/* Header Banner */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-red-600 block mb-2">
          Just In
        </span>
        <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-gray-900 mb-4">
          New Arrivals
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Be the first to wear our latest curated drop of premium embroidered fabrics, luxury pret, and modern silhouettes.
        </p>
        <div className="w-12 h-0.5 bg-black mx-auto mt-6" />
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <h3 className="text-base font-serif font-semibold text-gray-900 mb-1">
            No New Arrivals Right Now
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Check back soon for our next exclusive drop.
          </p>
          <Link
            href="/women"
            className="inline-block bg-black text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Explore Women&lsquo;s Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}