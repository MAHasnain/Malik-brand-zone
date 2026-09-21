'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/types';
import { useCartStore } from '@/store/useCartStore';

export default function ProductCard({ product }: { product: IProduct }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const isLoading = useCartStore((state) => state.isLoading);

  const cleanSlug = product?.slug?.replace(/^\/+/, '') || '';
  const productUrl = `/product/${cleanSlug}`;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white transition-all hover:shadow-lg">
      {/* Image Container */}
      <Link href={productUrl} className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        <Image
          src={product?.images[0] || '/placeholder.png'}
          alt={product?.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
            Sale
          </span>
        )}

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-black font-bold text-xs px-3 py-1 uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {product.category?.name || 'Collection'}
        </span>

        <Link href={`/product/${product.slug}`} className="text-sm font-medium text-gray-900 hover:underline line-clamp-1 mb-2">
          {product.title}
        </Link>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-base font-bold text-gray-900">
            PKR {activePrice?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              PKR {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => {
            // Debug log to confirm ID in browser console
            console.log("Adding Product ID:", product._id || (product as any).id);

            addToCart(
              product._id || (product as any).id, // Fallback if ID key varies
              product.sizes?.[0] || "Standard",
              product.colors?.[0] || "Default",
              1
            );
          }}
          disabled={isLoading || (product.stock !== undefined && product.stock <= 0)}
          className="mt-auto w-full bg-black text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded hover:bg-gray-800 disabled:opacity-50 transition"
        >
          {product.stock !== undefined && product.stock <= 0 ? "Out of Stock" : "Quick Add"}
        </button>
      </div>
    </div>
  );
}