import Link from 'next/link';
import ProductCard from './ProductCard';
import { getProducts } from '@/services/product.api';

export default async function TrendingProducts() {

    const products = await getProducts({ limit: 8 });

    return (
        <section className="bg-white py-16 lg:py-24 border-t border-gray-100">
            <div className="container mx-auto px-4 lg:px-8">

                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-serif text-gray-900 mb-2">New Arrivals</h2>
                        <p className="text-gray-500 text-sm">Handpicked selections for the season.</p>
                    </div>
                    <Link href="/new-arrivals" className="hidden sm:block text-sm font-medium underline underline-offset-4 hover:text-gray-600">
                        View All
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No new arrivals available right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Mobile View All Button */}
                <div className="mt-8 text-center sm:hidden">
                    <Link href="/new-arrivals" className="inline-block border border-black px-8 py-3 text-sm font-medium uppercase tracking-wide w-full">
                        View All Arrivals
                    </Link>
                </div>
            </div>
        </section>
    );
}