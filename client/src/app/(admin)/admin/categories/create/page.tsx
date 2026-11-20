"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createCategoryApi } from "@/services/admin.api";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Title typing par Slug auto-generate
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    );
  };

  // Direct Device Image Upload
  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dkqip1ihc";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "mbz_preset";

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      }
    } catch (error) {
      console.error("Cloudinary Upload Failed:", error);
      alert("Failed to upload image from device.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter Category Name");
      return;
    }

    setLoading(true);
    try {
      await createCategoryApi({
        name,
        slug,
        image: imageUrl || undefined,
      });

      alert("Category created successfully!");
      router.push("/admin/categories");
    } catch (error: any) {
      console.error("Failed to create category:", error);
      alert(error.response?.data?.message || "Error creating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Add New Category</h1>
        <p className="text-xs text-gray-500">Create product collections for store navigation menu.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        {/* Category Name & Slug */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Lawn 2026, Unstitched, Luxury Pret"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-black outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 outline-none text-gray-600"
            />
          </div>
        </div>

        {/* Category Banner/Cover Image */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">
            Category Banner Image (Optional)
          </label>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleDeviceImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <p className="text-xs font-semibold text-gray-700 mb-1">
              {uploadingImage ? "Uploading cover..." : "Tap to upload Category Banner"}
            </p>
            <p className="text-[10px] text-gray-400">Select image from gallery or device</p>
          </div>

          {/* Banner Preview */}
          {imageUrl && (
            <div className="relative w-full h-36 border rounded-lg overflow-hidden bg-gray-100 mt-2">
              <Image src={imageUrl} alt="Category Banner" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded hover:bg-gray-800 disabled:opacity-50 transition shadow-sm"
        >
          {loading ? "Creating..." : "Save Category"}
        </button>
      </form>
    </div>
  );
}