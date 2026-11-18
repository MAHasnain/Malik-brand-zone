import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllCategories } from "@/services/category.api";

export default async function CategoryGrid() {
  const categories = await getAllCategories();
  if (!categories.length) return null;

  return (
    <section className="mbz-section" aria-labelledby="collections">
      <h2 id="collections" className="mbz-heading">Shop by category</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const slug = category.slug.replace(/^\/+/, "").toLowerCase();
          const home = slug === "home-living";
          const href = home ? "/home-living" : `/women?category=${encodeURIComponent(category.slug)}`;
          const photo = category.imageURL || category.image;
          return (
            <Link key={category._id} href={href} className="mbz-category group">
              {photo && <span aria-hidden className="mbz-category-photo" style={{ backgroundImage: `url(${JSON.stringify(photo)})` }} />}
              <span className="relative capitalize">{home ? "Home & Living" : category.name}</span>
              <ArrowUpRight size={20} aria-hidden className="relative" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
