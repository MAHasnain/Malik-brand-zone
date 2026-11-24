import Link from "next/link";
import { getAllCategories } from "@/services/category.api";

const photos = {
  home: "photo-1600210492486-724fe5c67fb0",
  women: "photo-1483985988355-763728e1935b",
  men: "photo-1617137968427-85924c800a22",
  collection: "photo-1490481651871-ab68de25d43d",
};

function fallbackPhoto(name: string, slug: string) {
  const category = (slug + " " + name).toLowerCase().replace(/[^a-z]+/g, " ");
  if (/\b(home|living|decor)\b/.test(category)) return photos.home;
  if (/\b(women|womens|ladies|pret|unstitched)\b/.test(category)) return photos.women;
  if (/\b(men|mens)\b/.test(category)) return photos.men;
  return photos.collection;
}

function photoUrl(photo: string, width: number) {
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&q=80&w=${width}`;
}

export default async function CategoryGrid() {
  const categories = await getAllCategories();
  if (!Array.isArray(categories) || !categories.length) return null;
  const bedding = categories.find(({ name, slug }) =>
    [name, slug].some(value => /comforters?(?:and)?bedsheets?/i.test(value.replace(/[^a-z]/gi, "")))
  );
  const cards = categories.slice(0, 3);
  if (bedding && !cards.some(card => card._id === bedding._id)) cards.push(bedding);

  return (
    <section aria-labelledby="shop-by-category" className="mx-auto max-w-360 px-4 py-12 sm:px-8 lg:px-12 lg:py-20">
      <div className="mb-5 flex items-center gap-5 lg:mb-8 lg:gap-8">
        <h2 id="shop-by-category" className="font-serif text-3xl leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
          Shop by Category
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-neutral-300" />
      </div>

      <div className={`grid gap-3 sm:gap-4 ${cards.length > 1 ? "grid-cols-2" : "grid-cols-1"} ${cards.length === 3 ? "lg:grid-cols-[1.55fr_1fr] lg:grid-rows-2" : ""}`}>
        {cards.map((category, index) => {
          const featured = cards.length === 3 && index === 0;
          const photo = fallbackPhoto(category.name, category.slug);
          const imageURL = "imageURL" in category && typeof category.imageURL === "string" ? category.imageURL.trim() : "";
          const isBedding = category._id === bedding?._id;
          const image = isBedding ? "/images/comforters-and-bed-sheets.png" : imageURL || category.image?.trim();
          const shape = featured
            ? "col-span-2 aspect-[16/9] lg:col-span-1 lg:row-span-2 lg:aspect-auto"
            : cards.length === 3
              ? "aspect-[4/5] lg:aspect-[2.3/1]"
              : cards.length === 1 ? "aspect-[2/1] lg:aspect-[3/1]" : "aspect-[4/5] lg:aspect-[5/3]";

          return (
            <Link
              key={category._id}
              href={isBedding ? "/home-living#comforters-and-bed-sheets" : `/women?category=${category._id}`}
              className={`group relative isolate flex min-w-0 items-end overflow-hidden rounded-sm bg-stone-700 p-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:p-6 lg:p-8 ${shape}`}
            >
              {/* Native image supports both merchant URLs and temporary photos in one file. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                src={image || photoUrl(photo, 800)}
                srcSet={image ? undefined : [400, 640, 960, 1280].map(width => `${photoUrl(photo, width)} ${width}w`).join(", ")}
                sizes={featured || cards.length === 1 ? "(min-width: 1024px) 65vw, 100vw" : "(min-width: 1024px) 40vw, 50vw"}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-20 size-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.035]"
              />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/15 to-transparent" />
              <div className="min-w-0">
                <h3 className={`break-words font-serif leading-tight tracking-tight ${featured ? "text-3xl sm:text-4xl lg:text-5xl" : "text-xl sm:text-3xl"}`}>
                  {category.name}
                </h3>
                <span className="mt-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em]">
                  Explore <span aria-hidden="true" className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

