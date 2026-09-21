import Link from 'next/link';
import { getAllCategories } from '@/services/category.api';

export default async function CategoryGrid() {
  // Fetch real categories from MongoDB API
  const categories = await getAllCategories();

  if (!categories || categories.length === 0) {
    return null; // Do not render section if backend returns no categories
  }

  return (
    <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-gray-900 mb-3">Shop by Category</h2>
        <div className="w-16 h-0.5 bg-black mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
        {categories.slice(0, 3).map((cat, index) => {
          const colSpan = index === 0 ? "col-span-1 md:col-span-2 row-span-2" : "col-span-1";

          return (
            <Link 
              key={cat._id} 
              href={`/women?category=${cat._id}`}
              className={`relative group overflow-hidden ${colSpan}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.image || ''}')` }}
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-xl md:text-2xl font-serif tracking-wide">
                  {cat.name}
                </h3>
                <span className="text-white/80 text-sm font-medium tracking-widest uppercase mt-2 block opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Explore &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}