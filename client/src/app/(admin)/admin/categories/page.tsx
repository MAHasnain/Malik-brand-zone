"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICategory } from "@/types";
import { getAllCategories } from "@/services/category.api";
import { Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { deleteCategoryApi, updateCategoryApi } from "@/services/admin.api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State Management
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(null);

  // Form Field States
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenEdit = (cat: ICategory) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    const cleanSlug = (cat.slug || cat.name.toLowerCase()).replace(/^\//, "");
    setEditSlug(cleanSlug);
  };

  const handleNameChange = (val: string) => {
    setEditName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setEditSlug(generatedSlug);
  };

const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingCategory) return;

  setActionLoading(true);
  try {
    const formattedSlug = editSlug.trim().replace(/^\//, "");

    // Using centralized admin API helper
    const updatedCategory = await updateCategoryApi(editingCategory._id, {
      name: editName,
      slug: formattedSlug,
    });

    toast.success("Category updated successfully!");

    // State updated with returned updatedCategory or optimistic state
    setCategories((prev) =>
      prev.map((item) =>
        item._id === editingCategory._id
          ? {
              ...item,
              name: updatedCategory?.name || editName,
              slug: updatedCategory?.slug || formattedSlug,
            }
          : item
      )
    );

    setEditingCategory(null);
  } catch (err: unknown) {
    console.error("Update category error:", err);
    toast.error("Failed to update category. Ensure the slug is unique.");
  } finally {
    setActionLoading(false);
  }
};

// Submit Delete Action
const handleDelete = async () => {
  if (!deletingCategory) return;

  setActionLoading(true);
  try {
    // Using centralized admin API helper
    await deleteCategoryApi(deletingCategory._id);

    toast.success("Category deleted!");

    // Remove deleted category from local state
    setCategories((prev) =>
      prev.filter((item) => item._id !== deletingCategory._id)
    );

    setDeletingCategory(null);
  } catch (err: unknown) {
    console.error("Delete category error:", err);
    toast.error("Failed to delete category.");
  } finally {
    setActionLoading(false);
  }
};

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Categories & Collections
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage product categories for store filters
          </p>
        </div>

        <Link
          href="/admin/categories/create"
          className="bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-gray-800 transition shadow-sm"
        >
          + Add New Category
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-20 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-black" />
          <span>Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-500 mb-4">No categories created yet.</p>
          <Link
            href="/admin/categories/create"
            className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg"
          >
            Create First Category
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm hover:shadow transition"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  <Image
                    src={cat.image || "/placeholder.png"}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">
                    /{cat.slug ? cat.slug.replace(/^\//, "") : cat.name.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Action Icons (Edit & Delete) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg active:scale-95 transition"
                  aria-label="Edit Category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingCategory(cat)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg active:scale-95 transition"
                  aria-label="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT CATEGORY DIALOG MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h3 className="text-base font-serif font-bold text-gray-900">
                Edit Category
              </h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1 text-gray-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Category Slug
                </label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-3 text-xs font-bold uppercase border border-gray-200 rounded-xl text-gray-600 active:scale-95 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-3 text-xs font-bold uppercase bg-black text-white rounded-xl flex items-center justify-center active:scale-95 transition disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-gray-900">Delete Category?</h4>
            <p className="text-xs text-gray-500 mt-1">
              Are you sure you want to delete{" "}
              <span className="font-bold text-black">"{deletingCategory.name}"</span>?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="flex-1 py-3 text-xs font-bold border border-gray-200 rounded-xl text-gray-600 active:scale-95 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 py-3 text-xs font-bold bg-red-600 text-white rounded-xl flex items-center justify-center active:scale-95 transition disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}