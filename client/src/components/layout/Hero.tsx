import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[80vh] w-full bg-gray-100 flex items-center justify-center">
      {/* Background Image (Using a placeholder fashion image) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')" }}
      />
      
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-black/30" />

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
        <span className="text-white text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-4">
          New Collection 2026
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
          Elegance Reimagined for the Modern Woman
        </h1>
        <p className="text-white/90 text-base md:text-lg mb-8 max-w-xl font-light">
          Discover our latest arrivals featuring premium fabrics, intricate embroidery, and timeless silhouettes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/women" 
            className="bg-white text-black px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-100 transition-colors text-center"
          >
            Shop Now
          </Link>
          <Link 
            href="/sale" 
            className="bg-transparent border border-white text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-white/10 transition-colors text-center"
          >
            Explore Sale
          </Link>
        </div>
      </div>
    </section>
  );
}