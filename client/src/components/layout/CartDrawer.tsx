"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCartStore, ICartItem } from "@/store/useCartStore";

export default function CartDrawer() {
  const { isOpen, closeCart, cart, updateQuantity, removeItem } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const items: ICartItem[] = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-999 backdrop-blur-sm"
          />

          {/* Sliding Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-1000 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-black" />
                <h3 className="font-serif font-bold text-lg text-gray-900">Your Cart</h3>
                <span className="text-xs bg-gray-100 font-bold px-2 py-0.5 rounded-full text-gray-700">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 text-gray-400 hover:text-black rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm font-semibold text-gray-500">
                    Your cart is currently empty
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-4 text-xs font-bold uppercase tracking-wider text-black underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item, idx) => {
                  const itemId = (item as unknown as { _id?: string })._id || String(idx);
                  const imageUrl = item.product?.images?.[0] || "/placeholder.png";

                  return (
                    <div
                      key={itemId}
                      className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 items-center"
                    >
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={imageUrl}
                          alt={item.product?.title || "Product Image"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.product?.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {item.size && `Size: ${item.size}`}{" "}
                          {item.color && `| Color: ${item.color}`}
                        </p>
                        <p className="text-xs font-bold text-black mt-1">
                          Rs.{" "}
                          {(
                            item.product?.discountPrice || item.product?.price || 0
                          ).toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(itemId, Math.max(1, item.quantity - 1))
                            }
                            className="w-6 h-6 border bg-white rounded text-xs font-bold flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="w-6 h-6 border bg-white rounded text-xs font-bold flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(itemId)}
                        className="text-gray-400 hover:text-red-600 p-1 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer / Checkout Button */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-lg font-serif font-bold text-black">
                    Rs. {totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    alert("Proceeding to Checkout");
                  }}
                  className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-gray-800 transition"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}