import { getProductBySlug } from "@/services/product.api";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const rawSlug = resolvedParams?.slug;

  if (!rawSlug) {
    notFound();
  }

  const cleanSlug = decodeURIComponent(rawSlug).replace(/^\/+|\/+$/g, "");

  const product = await getProductBySlug(cleanSlug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}