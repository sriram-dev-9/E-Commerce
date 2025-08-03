// src/lib/cart.ts
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type { Product, Variant } from "./products";

export type CartItem = {
  id: number;
  product: Product;
  variant?: Variant;
  quantity: number;
  price: number;
  available_stock: number;
};

export type Cart = {
  items: CartItem[];
  total_price: number;
  total_items: number;
};

// Fetch the user's cart
export function fetchCart(): Promise<Cart> {
  return apiGet<Cart>("/api/cart/");
}

// Add an item to the cart with optional variant
export function addToCart(productId: number, quantity: number, variantId?: number): Promise<CartItem> {
  const payload: { product_id: number; quantity: number; variant_id?: number } = {
    product_id: productId,
    quantity
  };
  
  if (variantId) {
    payload.variant_id = variantId;
  }
  
  return apiPost<CartItem>("/api/cart/add/", payload);
}

// Update item quantity
export function updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
  return apiPut<CartItem>(`/api/cart/update/${itemId}/`, { quantity });
}

// Remove an item from the cart
export function removeFromCart(itemId: number): Promise<void> {
  return apiDelete(`/api/cart/remove/${itemId}/`);
}

// Clear the entire cart
export function clearCart(): Promise<void> {
  return apiPost("/api/cart/clear/");
}

// Get cart summary
export function fetchCartSummary(): Promise<{ total_items: number; total_price: number }> {
  return apiGet("/api/cart/summary/");
}
