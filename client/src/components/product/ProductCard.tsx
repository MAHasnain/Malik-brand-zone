'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/types';
import { useCartStore } from '@/store/useCartStore';

export default function ProductCard({ product }: { product: IProduct }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [adding, setAdding] = useState(false);
  const needsOptions = product.sizes?.length > 1 || product.colors?.length > 1;

  const cleanSlug = product?.slug?.replace(/^\/+/, '') || product._id;
  const productUrl = `/product/${cleanSlug}`;

  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden border border-[#e4ddd3] bg-white transition-all hover:shadow-lg">
      {/* Image Container */}
      <Link href={productUrl} className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        <Image
          src={product.images?.[0] || '/placeholder.png'}
          alt={product?.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.025]"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-[#774936] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
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
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
          {product.category?.name || 'Collection'}
        </span>

        <Link href={productUrl} className="text-sm font-medium text-gray-900 hover:underline line-clamp-1 mb-2">
          {product.title}
        </Link>

        {/* Price Section */}
        <div className="flex flex-wrap items-baseline gap-x-2 mb-4">
          <span className="text-base font-bold text-gray-900">
            PKR {activePrice?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-stone-600 line-through">
              PKR {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        {needsOptions && product.stock > 0 ? (
          <Link href={productUrl} className="mt-auto grid min-h-11 place-items-center bg-[#513628] px-2 text-center text-sm font-medium text-white">
            Choose options
          </Link>
        ) : (
          <button
            type="button"
            disabled={adding || product.stock <= 0}
            onClick={async () => {
              setAdding(true);
              try {
                await addToCart(product, product.sizes?.[0] || "Standard", product.colors?.[0] || "Default", 1);
              } finally {
                setAdding(false);
              }
            }}
            className="mt-auto min-h-11 bg-[#513628] px-2 text-sm font-medium text-white disabled:bg-stone-600"
          >
            {product.stock <= 0 ? "Out of stock" : adding ? "Adding…" : "Quick add"}
          </button>
        )}
      </div>
    </div>
  );
}
