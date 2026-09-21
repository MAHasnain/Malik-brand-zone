'use client';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeItem, isLoading } = useCartStore();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={closeDrawer} />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">Your Cart ({cart?.totalItems || 0})</h2>
            <button onClick={closeDrawer} className="text-gray-400 hover:text-gray-600 p-1 text-xl font-bold">
              ✕
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!cart?.items || cart.items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-base font-medium">Your cart is currently empty.</p>
              </div>
            ) : (
              cart.items.map((item) => {
                const product = item.product;
                if (!product) return null;

                const price = product.discountPrice || product.price;

                return (
                  <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.selectedSize && `Size: ${item.selectedSize}`} {item.selectedColor && `| Color: ${item.selectedColor}`}
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-1">Rs. {price.toLocaleString()}</p>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isLoading}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={isLoading}
                            className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Actions */}
          {cart && cart.items.length > 0 && (
            <div className="border-t p-6 bg-gray-50 space-y-4">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Subtotal</span>
                <span>Rs. {cart.totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="block w-full text-center bg-black text-white font-medium py-3 rounded hover:bg-gray-800 transition"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}