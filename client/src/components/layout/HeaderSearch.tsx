"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/types";
import { getProducts } from "@/services/product.api";

export default function HeaderSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                const data = await getProducts({ search: query });
                setResults(data.slice(0, 5)); // Limit top 5 instant results
                setIsLoading(false);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsOpen(false);
        router.push(`/women?search=${encodeURIComponent(query.trim())}`);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-md">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-gray-100 border border-transparent focus:border-black focus:bg-white text-xs px-4 py-2.5 rounded-full outline-none transition-all"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-black">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>

            {/* Live Results Dropdown */}
            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden">
                    {isLoading ? (
                        <div className="p-4 text-center text-xs text-gray-400">Searching...</div>
                    ) : results.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {results.map((product) => {
                                const cleanSlug = product.slug?.replace(/^\/+/, "") || "";
                                return (
                                    <Link
                                        key={product._id}
                                        href={`/product/${cleanSlug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                                    >
                                        <div className="relative w-10 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                                            <Image
                                                src={product.images?.[0] || "/placeholder.png"}
                                                alt={product.title || "Product"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-medium text-gray-900 truncate">{product.title}</h4>
                                            <p className="text-xs text-gray-500 font-semibold">
                                                PKR {(product.discountPrice || product.price).toLocaleString()}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                            <button
                                onClick={handleSubmit}
                                className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-black bg-gray-50 hover:bg-gray-100"
                            >
                                View all results ({results.length})
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-xs text-gray-500">No products found for "{query}"</div>
                    )}
                </div>
            )}
        </div>
    );
}