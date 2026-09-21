import Hero from "@/components/layout/Hero";
import CategoryGrid from "@/components/layout/CategoryGrid";
import TrendingProducts from "@/components/product/TrendingProducts";

export default function Home() {
  return (
    <main>
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Visual Navigation Grid */}
      <CategoryGrid />

      {/* 3. New Arrivals / Trending Grid */}
      <TrendingProducts />

      {/* 4. Brand Value Proposition */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-serif mb-4">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed mb-8">
            Experience the finest fabrics tailored to perfection. We blend traditional aesthetics with modern silhouettes to bring you clothing that empowers and inspires.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-sm font-medium text-gray-800">
            <span>✓ Premium Quality</span>
            <span className="hidden md:inline">•</span>
            <span>✓ Nationwide Delivery</span>
            <span className="hidden md:inline">•</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>
      </section>
    </main>
  );
}