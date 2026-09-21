import { IProduct, ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ProductQueryParams {
  category?: string;
  search?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// 1. Get All Products with Dynamic Filters
export async function getProducts(params?: ProductQueryParams): Promise<IProduct[]> {
  try {
    const query = new URLSearchParams();

    if (params?.category) query.append("category", params.category);
    if (params?.search) query.append("search", params.search);
    if (params?.isFeatured !== undefined) query.append("isFeatured", String(params.isFeatured));
    if (params?.minPrice) query.append("minPrice", String(params.minPrice));
    if (params?.maxPrice) query.append("maxPrice", String(params.maxPrice));
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const res = await fetch(`${BASE_URL}/products?${query.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch products");
    const result = await res.json();
    
    // Backend returns either array directly or paginated object { products, total }
    return result?.data?.products || result?.data || [];
  } catch (error) {
    console.error("getProducts Error:", error);
    return [];
  }
}

// 2. Get Single Product by Slug
export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const targetSlug = slug.toLowerCase().trim();

    // Fetch products list from API
    const res = await fetch(`${BASE_URL}/products`, { cache: "no-store" });

    if (!res.ok) {
      console.error(`Backend returned status: ${res.status}`);
      return null;
    }

    const responseData = await res.json();
    
    // Normalize response payload arrays
    const products: IProduct[] = 
      responseData?.data?.products || 
      responseData?.data || 
      (Array.isArray(responseData) ? responseData : []);

    if (!Array.isArray(products) || products.length === 0) {
      console.warn("No products array returned from backend API");
      return null;
    }

    // 🎯 Robust Product Matcher: slug OR _id matching
    const matchedProduct = products.find((p) => {
      const pSlug = (p.slug || "").toLowerCase().replace(/^\/+|\/+$/g, "");
      const pId = String(p._id || "").toLowerCase();
      return pSlug === targetSlug || pId === targetSlug;
    });

    if (matchedProduct) {
      return matchedProduct;
    }

    console.warn(`No DB product matched for target slug: "${targetSlug}"`);
    return null;
  } catch (error) {
    console.error("getProductBySlug Error:", error);
    return null;
  }
}

// 3. Get Products By Category Slug
export async function getProductsByCategorySlug(categorySlug: string): Promise<IProduct[]> {
  try {
    const res = await fetch(`${BASE_URL}/products?category=${categorySlug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch category products");
    const result = await res.json();
    return result?.data?.products || result?.data || [];
  } catch (error) {
    console.error("getProductsByCategorySlug Error:", error);
    return [];
  }
}