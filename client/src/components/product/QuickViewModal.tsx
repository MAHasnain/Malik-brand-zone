"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { IProduct } from "@/types";

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct | null;
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewProps) {
  const { addToCart } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0] || "");

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(
      product._id,
      selectedSize,
      selectedColor,
      1
    );
    onClose();
  };

  // Safe image fallback
  const displayImage = product.images?.[0] || "/placeholder.png";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white z-90 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 h-64 md:h-125 bg-gray-100 relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${displayImage}')` }}
              />
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col">
              <h2 className="text-2xl font-serif mb-2">{product.title}</h2>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xl font-medium">
                  Rs. {(product.discountPrice || product.price).toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Select Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 border text-sm flex items-center justify-center transition-colors ${selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector (If colors exist) */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Select Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1 border text-xs flex items-center justify-center transition-colors ${selectedColor === color
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 font-medium tracking-wide hover:bg-gray-800 transition-colors mt-auto"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}