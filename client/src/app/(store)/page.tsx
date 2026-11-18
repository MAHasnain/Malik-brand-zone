import Hero from "@/components/layout/Hero";
import CategoryGrid from "@/components/layout/CategoryGrid";
import TrendingProducts from "@/components/product/TrendingProducts";

export default function Home() {
  return (
    <div className="bg-[#faf8f4]">
      <Hero />
      <CategoryGrid />
      <TrendingProducts />
    </div>
  );
}
