import Link from "next/link";
import { Home as HomeIcon } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/product.api";

const slug = "comforters-and-bed-sheets";

export default async function HomeLivingPage({ searchParams }: {
  searchParams: Promise<{ page?: string }>;
}) {
  const value = Number((await searchParams).page);
  const page = Number.isSafeInteger(value) && value > 0 ? value : 1;
  const [bedding, home] = await Promise.all([
    getProducts({ category: slug, page, limit: 12 }),
    getProducts({ category: "home-living" }),
  ]);
  const next = bedding.length === 12 ? await getProducts({ category: slug, page: page + 1, limit: 12 }) : [];
  return (
    <div className="min-h-screen bg-brand-paper">
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


      <section id={slug} aria-labelledby="bedding-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 lg:px-8">
        <h2 id="bedding-title" className="mb-6 font-serif text-3xl">Comforters and Bed Sheets</h2>
        {bedding.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {bedding.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : <p>No bedding products available on this page.</p>}
        {(page > 1 || next.length > 0) && (
          <nav aria-label="Bedding pages" className="mt-6 flex gap-4">
            {page > 1 && <Link className="p-3 underline" href={`/home-living?page=${page - 1}#${slug}`}>Previous</Link>}
            {next.length > 0 && <Link className="p-3 underline" href={`/home-living?page=${page + 1}#${slug}`}>Next</Link>}
          </nav>
        )}
      </section>
      {home.length > 0 && (
        <section aria-label="Home & Living products" className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 pb-12 md:grid-cols-3 lg:grid-cols-4 lg:px-8">
          {home.map(product => <ProductCard key={product._id} product={product} />)}
        </section>
      )}
    </div>
  );
}
