import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="mbz-hero" aria-labelledby="collection-title">
      <div className="mbz-hero-copy">
        <p className="mbz-kicker">Malik Brand Zone</p>
        <h1 id="collection-title">The everyday<br /><em>wardrobe.</em></h1>
        <p className="mbz-intro">Explore the latest clothing arrivals and find your next everyday favourite.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/new-arrivals" className="mbz-primary">Shop new arrivals <ArrowUpRight size={17} aria-hidden /></Link>
          <Link href="/sale" className="mbz-secondary">Explore sale</Link>
        </div>
      </div>
      <div className="mbz-hero-photo" aria-hidden="true" />
    </section>
  );
}
