// src/lib/cart.ts
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type { Product } from "./products";

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
  price: number;
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

// Add an item to the cart
export function addToCart(productId: number, quantity: number): Promise<CartItem> {
  return apiPost<CartItem>("/api/cart/add/", { product_id: productId, quantity });
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
