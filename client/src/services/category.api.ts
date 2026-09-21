import { ICategory, ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// 1. Get All Categories (SSR / Server Component Compatible)
export async function getAllCategories(): Promise<ICategory[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const result: ApiResponse<ICategory[]> = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("getAllCategories Error:", error);
    return [];
  }
}

// 2. Get Category by Slug
export async function getCategoryBySlug(slug: string): Promise<ICategory | null> {
  try {
    const res = await fetch(`${BASE_URL}/categories/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Category not found");
    const result: ApiResponse<ICategory> = await res.json();
    return result.data || null;
  } catch (error) {
    console.error("getCategoryBySlug Error:", error);
    return null;
  }
}