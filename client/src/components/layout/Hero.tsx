import Link from "next/link";

import BannerSlideshow from "../layout/BannerSlideshow";
import { publishedBanners } from "@/services/admin.api";

const collectionPhoto =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d";

export default async function Hero() {
  const images = await publishedBanners();
  return (
    <section
      aria-labelledby="collection-heading"
      className="grid bg-white text-neutral-950 md:grid-cols-[5fr_6fr]"
    >
      <div
        className="relative h-[clamp(10rem,25svh,16rem)] overflow-hidden bg-neutral-100 md:col-start-2 md:row-start-1 md:h-auto"
      >
        <BannerSlideshow key={JSON.stringify(images)} images={images}>
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet={photoSources([640, 960, 1280, 1664])}
            sizes="55vw"
          />
          {/* Unsplash provides the responsive crops directly. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl(768)}
            srcSet={photoSources([480, 768, 1080])}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover object-[center_55%]"
          />
        </picture>
        </BannerSlideshow>
      </div>

      <div className="flex flex-col items-start justify-center px-5 py-7 sm:px-10 md:col-start-1 md:row-start-1 md:min-h-[26rem] md:px-[5vw] md:py-12 xl:min-h-[32rem]">
        <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]">
          <span aria-hidden="true" className="h-px w-8 bg-current" />
          New Collection 2026
        </span>
        <h1
          id="collection-heading"
          className="mt-4 max-w-[17ch] text-balance font-serif text-[clamp(2.1rem,4.1vw,4.75rem)] leading-[1.04] tracking-tight"
        >
          Elegance Reimagined for the Modern Woman
        </h1>
        <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-neutral-700 sm:text-base">
          Discover our latest arrivals featuring premium fabrics, intricate embroidery, and timeless silhouettes.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/women"
            className="inline-flex min-h-11 items-center justify-center bg-neutral-950 px-5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Shop Now
          </Link>
          <Link
            href="/sale"
            className="inline-flex min-h-11 items-center justify-center border border-neutral-400 px-5 text-xs font-semibold uppercase tracking-wider hover:border-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Explore Sale
          </Link>
        </div>
      </div>
    </section>
  );
}

function photoUrl(width: number) {
  return `${collectionPhoto}?auto=format&fit=crop&q=80&w=${width}`;
}

function photoSources(widths: number[]) {
  return widths.map((width) => `${photoUrl(width)} ${width}w`).join(", ");
}
