"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import EditProductDialog from "./EditProductDialog";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types";
import { getProducts } from "@/services/product.api";
import { deleteProductApi } from "@/services/admin.api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<IProduct | null>(null);
  const router = useRouter();


  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    // const token = localStorage.getItem("admin_token");
    // if (!token) {
    //   router.push("/admin/login");
    //   return;
    // }

    fetchCatalog();
  }, [router]);

  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<IProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function deleteSelected() {
    if (!selected || deleting) return;
    setDeleting(true);
    try {
      await deleteProductApi(selected._id);
      setProducts(current => current.filter(item => item._id !== selected._id));
      dialog.current?.close();
      toast.success("Product deleted.");
    } catch {
      dialog.current?.close();
      toast.error("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <dialog ref={dialog} aria-labelledby="delete-product-heading"
        onCancel={event => { if (deleting) event.preventDefault(); }}
        onClose={() => setSelected(null)}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl border border-(--line) bg-brand-surface p-6 text-brand-ink backdrop:bg-black/50">
        <h2 id="delete-product-heading" className="text-lg font-semibold">Delete product?</h2>
        <p className="my-4 wrap-break-word">Delete “{selected?.title}” from your catalog?</p>
        <div className="flex justify-end gap-3">
          <button autoFocus type="button" disabled={deleting} onClick={() => dialog.current?.close()}
            className="min-h-11 rounded-lg border px-4">Cancel</button>
          <button type="button" disabled={deleting} onClick={deleteSelected}
            className="min-h-11 rounded-lg bg-red-700 px-4 text-white">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </dialog>
      {editing && <EditProductDialog product={editing} onClose={() => setEditing(null)} onSaved={updated => {
        setProducts(current => current.map(item => item._id === updated._id ? updated : item));
        setEditing(null);
      }} />}
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Inventory Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Manage all live products and stock levels</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/products/create"
            className="flex-1 sm:flex-none text-center bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-gray-800 transition shadow-sm"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* Mobile-Friendly Product Table / Cards */}
      {loading ? (
        <div className="py-20 text-center text-sm text-gray-500">Loading live inventory...</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-500 mb-4">No products found in store.</p>
          <Link
            href="/admin/products/create"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg"
          >
            Create First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="block w-full text-left text-xs md:table">
              <thead className="hidden md:table-header-group bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group divide-y divide-gray-100 font-medium text-gray-700">
                {products.map((item) => (
                  <tr key={item._id} className="grid grid-cols-2 items-center md:table-row hover:bg-gray-50/50 transition [&>td:first-child]:col-span-2 [&>td:last-child]:col-span-2">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                        <Image
                          src={item.images?.[0] || "/placeholder.png"}
                          alt={item.title || "Product"}
                          fill sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-900 truncate max-w-[180px] sm:max-w-xs">
                        {item.title}
                      </span>
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] tracking-wider text-gray-500">
                      {item.category?.name || "General"}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      PKR {(item.discountPrice ?? item.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                          }`}
                      >
                        {item.stock > 0 ? `${item.stock} In Stock` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEditing(item)} aria-label={`Edit ${item.title}`}
                          className="inline-flex min-h-11 items-center gap-1 rounded-lg border px-3">
                          <Pencil size={16} aria-hidden="true" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelected(item);
                            dialog.current?.showModal();
                          }}
                          type="button" aria-label={`Delete ${item.title}`} className="inline-flex min-h-11 items-center gap-1 rounded-lg border px-3 text-red-600"
                        >
                          <Trash2 size={16} aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
