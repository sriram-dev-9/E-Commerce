// Types for products and reviews
export type Variant = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export type Review = {
  id: number;
  user: string;
  rating: number;
  comment: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  dataAiHint?: string;
  category: Category | number; // may be nested or just id
  subcategory: string;
  effective_price: number; // Always from variants
  price_range: string; // Display price range
  total_stock: number; // Total across all variants
  rating?: number;
  reviews?: Review[];
  variants: Variant[]; // Always has at least one variant
  has_variants: boolean;
  is_in_stock: boolean;
};

import { apiGet } from "@/lib/api";

// Fetch all products from backend
export async function fetchProducts(params?: Record<string, string | number>): Promise<Product[]> {
  let url = "/api/products/";
  if (params) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    url += `?${query}`;
  }
  return apiGet<Product[]>(url);
}

// Fetch a single product by slug
export async function fetchProduct(slug: string): Promise<Product> {
  return apiGet<Product>(`/api/products/${slug}/`);
}

// Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  return apiGet<Category[]>("/api/products/categories/");
}

