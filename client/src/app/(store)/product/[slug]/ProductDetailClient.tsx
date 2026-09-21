"use client";

import { useState } from "react";
import Image from "next/image";
import { IProduct } from "@/types";
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetailClient({ product }: { product: IProduct }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const isLoading = useCartStore((state) => state.isLoading);

    // Dynamic values with strict fallbacks
    const title = product?.title || (product as any)?.name || "Untitled Product";
    const images = product?.images?.length ? product.images : ["/placeholder.png"];
    const sizes = product?.sizes?.length ? product.sizes : ["Standard"];
    const colors = product?.colors?.length ? product.colors : ["Default"];

    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"fabric" | "delivery" | null>("fabric");

    
    
    const activePrice =
        product?.discountPrice && product.discountPrice < product.price
            ? product.discountPrice
            : product?.price || 0;

    const handleAddToCart = () => {
        if (!product?._id) return;
        addToCart(product._id, selectedSize, selectedColor, quantity);
    };

    const handleWhatsAppBuy = () => {
        const phoneNumber = "+923172888917";
        const messageText =
            `Hi Malik Brand Zone! I want to place an order:\n\n` +
            `*Product:* ${title}\n` +
            `*Price:* PKR ${activePrice.toLocaleString()}\n` +
            `*Selected Size:* ${selectedSize}\n` +
            `*Selected Color:* ${selectedColor}\n` +
            `*Quantity:* ${quantity}\n\n` +
            `*Product Link:* ${window.location.href}`;

        window.open(
            `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(messageText)}`,
            "_blank"
        );
    };

    return (
        <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-16">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                {/* Left: Image Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col-reverse sm:flex-row gap-4">
                    <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto w-full sm:w-20 shrink-0 no-scrollbar">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`relative aspect-[3/4] w-16 sm:w-full border-2 rounded overflow-hidden bg-gray-100 transition-all ${selectedImage === img ? "border-black shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${title} thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 aspect-[3/4] bg-gray-100 relative rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                        <Image
                            src={selectedImage}
                            alt={title}
                            fill
                            priority
                            className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {product?.discountPrice && (
                            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                                Sale
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: Product Details Panel */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        {product?.category?.name || "Collection"}
                    </span>

                    <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-4">{title}</h1>

                    {/* Price & Stock */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                        <span className="text-2xl font-bold text-gray-900">
                            PKR {activePrice.toLocaleString()}
                        </span>
                        {product?.discountPrice && (
                            <span className="text-lg text-gray-400 line-through">
                                PKR {product.price.toLocaleString()}
                            </span>
                        )}
                        <span
                            className={`ml-auto text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${(product?.stock ?? 0) > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                }`}
                        >
                            {(product?.stock ?? 0) > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                        </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                        {product?.description || "No description available for this item."}
                    </p>

                    {/* Color Picker */}
                    {colors.length > 0 && colors[0] !== "Default" && (
                        <div className="mb-6">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-3">
                                Color: <span className="text-black font-bold">{selectedColor}</span>
                            </h4>
                            <div className="flex gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 text-xs font-medium border rounded transition-all ${selectedColor === color ? "border-black bg-black text-white" : "border-gray-200 hover:border-black text-gray-800"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Selector */}
                    <div className="mb-8">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-3">
                            Select Size
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 text-xs font-bold border rounded transition-all ${selectedSize === size ? "border-black bg-black text-white shadow-sm" : "border-gray-200 hover:border-black text-gray-800"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-8">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-3">Quantity</h4>
                        <div className="flex items-center border border-gray-300 w-32 rounded">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 flex-1 text-center font-bold"
                            >
                                -
                            </button>
                            <span className="px-3 py-2 text-xs font-bold text-center flex-1">{quantity}</span>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 flex-1 text-center font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <button
                            onClick={handleAddToCart}
                            disabled={isLoading || (product?.stock ?? 0) <= 0}
                            className="flex-1 bg-black text-white py-4 text-xs font-semibold uppercase tracking-widest rounded hover:bg-gray-800 disabled:opacity-50 transition shadow-sm"
                        >
                            {(product?.stock ?? 0) <= 0 ? "Out of Stock" : "Add to Bag"}
                        </button>

                        <button
                            onClick={handleWhatsAppBuy}
                            className="flex-1 border border-emerald-600 text-emerald-700 bg-emerald-50/50 py-4 text-xs font-semibold uppercase tracking-widest rounded hover:bg-emerald-600 hover:text-white transition"
                        >
                            Buy via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}