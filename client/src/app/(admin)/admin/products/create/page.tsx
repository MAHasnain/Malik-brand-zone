"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { ICategory } from "@/types";
import { getAllCategories } from "@/services/category.api";
import { createProductApi } from "@/services/admin.api";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "Single", "Queen", "King", "Unstitched", "Standard"];

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("");
  const [fabric, setFabric] = useState("");
  const [stock, setStock] = useState("10");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["Standard"]);

  // Array storing uploaded Cloudinary URLs automatically
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const data = await getAllCategories();
      setCategories(data);
      if (data.length > 0) setCategory(data[0]._id);
    }
    loadCategories();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // 📸 DIRECT DEVICE FILE UPLOAD HANDLER
  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length + uploadedImages.length > 3) {
      toast.error("Choose up to 3 product images.");
      e.target.value = "";
      return;
    }

    setUploadingImages(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dkqip1ihc";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "mbz_preset";

    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || typeof data.secure_url !== "string") {
          throw new Error(data.error?.message || "Image upload failed.");
        }
        newUrls.push(data.secure_url);
      }


    } catch (error) {
      console.error("Cloudinary Direct Upload Failed:", error);
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploadedImages(prev => [...prev, ...newUrls]);
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !category) {
      toast.error("Please fill all required fields (Title, Price, Category)");
      return;
    }

    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image of the product.");
      return;
    }

    setLoading(true);
    try {
      await createProductApi({
        title,
        slug,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        category: category as any,
        fabric,
        stock: Number(stock),
        sizes: selectedSizes,
        colors: ["Default"],
        images: uploadedImages,
        isFeatured: true,
      });

      toast.success("Product published successfully!");
      router.push("/admin/products");
    } catch (error: unknown) {
      console.error("Failed to create product:", error);
      const response = error && typeof error === "object" && "response" in error ? error.response : undefined;
      const data = response && typeof response === "object" && "data" in response ? response.data : undefined;
      const message = data && typeof data === "object" && "message" in data ? data.message : undefined;
      toast.error(typeof message === "string" ? message : "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Add New Product</h1>
        <p className="text-xs text-gray-500">Upload product photos directly from device and publish to store.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Product Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Luxury Lawn Embroidered Suit"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-black outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 outline-none"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Price (PKR) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="4999"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-black outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Discount Price</label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="3999"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-black outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Stock Inventory *</label>
            <input
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-black outline-none"
            />
          </div>
        </div>

        {/* Category & Fabric */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-black outline-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Fabric Type</label>
            <input
              type="text"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              placeholder="e.g. Lawn / Cotton / Silk"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-black outline-none"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Available Sizes</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((sz) => {
              const selected = selectedSizes.includes(sz);
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`px-4 py-1.5 text-xs font-bold border rounded transition ${selected ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200"
                    }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* 🚀 DEVICE IMAGE UPLOAD SECTION */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Product Images *</label>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative mb-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleDeviceImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <p className="text-xs font-semibold text-gray-700 mb-1">
              {uploadingImages ? "Uploading photos..." : "Click or Drag photos from Device"}
            </p>
            <p className="text-[10px] text-gray-400">Upload multiple photos (PNG, JPG, WEBP)</p>
          </div>

          {/* Uploaded Thumbnails Preview */}
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {uploadedImages.map((url, idx) => (
                <div key={idx} className="relative w-20 h-24 border rounded overflow-hidden bg-gray-100 group">
                  <Image src={url} alt={`Upload ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Product Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item description..."
            className="w-full border border-gray-200 rounded p-3 text-sm focus:border-black outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImages}
          className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded hover:bg-gray-800 disabled:opacity-50 transition shadow-sm"
        >
          {loading ? "Publishing..." : "Publish Product"}
        </button>
      </form>
    </div>
  );
}
