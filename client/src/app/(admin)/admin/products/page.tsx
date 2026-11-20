"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types";
import { getProducts } from "@/services/product.api";
import { deleteProductApi } from "@/services/admin.api";
import { api } from "@/lib/axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteProductApi(id);
        setProducts((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

const handleLogout = async () => {
  try {
    await api.post("/auth/logout"); 
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/admin/login");
  }
};

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-red-600 border border-red-200 bg-red-50 px-4 py-3 rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
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
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                        <Image
                          src={item.images?.[0] || "/placeholder.png"}
                          alt={item.title || "Product"}
                          fill
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
                      PKR {(item.discountPrice || item.price).toLocaleString()}
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
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        className="text-red-600 hover:text-red-800 font-semibold transition text-xs"
                      >
                        Delete
                      </button>
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