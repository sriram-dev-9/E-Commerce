'use client';

import { useState, useCallback, createContext, useContext } from "react";
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from "@/lib/cart";
import type { Product } from "@/lib/products";
import type { CartItem } from "@/lib/cart";

type CartContextType = ReturnType<typeof useCart> | null;

const CartContext = createContext<CartContextType>(null);

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeCart = useCallback(async () => {
    setLoading(true);
    try {
      const cart = await fetchCart();
      setItems(cart.items);
      setTotalItems(cart.total_items);
      setTotalPrice(cart.total_price);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, []);

  const addToCart = async (product: Product, quantity: number) => {
    setLoading(true);
    await apiAddToCart(product.id, quantity);
    await initializeCart();
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    setLoading(true);
    if (quantity <= 0) {
      await apiRemoveFromCart(itemId);
    } else {
      await apiUpdateCartItem(itemId, quantity);
    }
    await initializeCart();
  };

  const removeFromCart = async (itemId: number) => {
    setLoading(true);
    await apiRemoveFromCart(itemId);
    await initializeCart();
  };

  const clearCart = async () => {
    setLoading(true);
    await apiClearCart();
    await initializeCart();
  };

  return {
    items,
    totalItems,
    totalPrice,
    loading,
    isInitialized,
    initializeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}