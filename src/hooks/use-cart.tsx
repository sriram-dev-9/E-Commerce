'use client';

import { useState, useCallback, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from "@/lib/cart";
import { logout, getAccessToken } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import type { CartItem } from "@/lib/cart";

type CartContextType = ReturnType<typeof useCart> | null;

const CartContext = createContext<CartContextType>(null);

// Guest cart storage key
const GUEST_CART_KEY = 'guest_cart';

// Helper functions for guest cart
const getGuestCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setGuestCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const clearGuestCart = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_CART_KEY);
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addingProducts, setAddingProducts] = useState<Set<number>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Check authentication status
  const checkAuth = useCallback(() => {
    const token = getAccessToken();
    const wasAuthenticated = isAuthenticated;
    const isNowAuthenticated = !!token;
    
    setIsAuthenticated(isNowAuthenticated);
    
    // If user just logged in, transfer guest cart to server
    if (!wasAuthenticated && isNowAuthenticated) {
      const guestItems = getGuestCart();
      if (guestItems.length > 0) {
        transferGuestCartToServer(guestItems);
      }
    }
    
    return isNowAuthenticated;
  }, [isAuthenticated]);

  // Transfer guest cart items to server
  const transferGuestCartToServer = async (guestItems: CartItem[]) => {
    try {
      for (const item of guestItems) {
        await apiAddToCart(item.product.id, item.quantity);
      }
      clearGuestCart();
      await initializeCart();
      toast({
        title: "Welcome back!",
        description: "Your cart items have been restored.",
      });
    } catch (error) {
      console.error("Failed to transfer guest cart:", error);
    }
  };

  // Update local state based on items
  const updateLocalState = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    setTotalItems(newItems.reduce((sum, item) => sum + item.quantity, 0));
    setTotalPrice(newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  }, []);

  const handleAuthError = useCallback((error: any) => {
    if (error?.response?.status === 401) {
      // Clear any invalid tokens and redirect to login
      logout();
      toast({
        title: "Authentication Required",
        description: "Please log in to continue shopping.",
        variant: "destructive",
      });
      return true; // Indicates auth error was handled
    }
    return false; // Auth error was not handled
  }, [toast]);

  const initializeCart = useCallback(async () => {
    setLoading(true);
    try {
      if (checkAuth()) {
        // User is authenticated, fetch from server
        const cart = await fetchCart();
        updateLocalState(cart.items);
      } else {
        // User is not authenticated, load from local storage
        const guestItems = getGuestCart();
        updateLocalState(guestItems);
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        console.error("Failed to fetch cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [checkAuth, updateLocalState, handleAuthError, toast]);

  const addToCart = async (product: Product, quantity: number, variantId?: number) => {
    // For products with variants, require variant selection
    if (product.variants && product.variants.length > 0 && !variantId) {
      toast({
        title: "Select Variant",
        description: "Please select a variant for this product.",
        variant: "destructive",
      });
      return;
    }
    
    // Check stock before adding
    const getTotalStock = (): number => {
      if (variantId && product.variants) {
        const variant = product.variants.find(v => v.id === variantId);
        return variant ? variant.stock : 0;
      }
      if (product.stock !== undefined) {
        return product.stock;
      }
      if (product.variants && product.variants.length > 0) {
        return product.variants.reduce((total, variant) => total + variant.stock, 0);
      }
      return 0;
    };
    
    const totalStock = getTotalStock();
    
    // Check if product is out of stock
    if (totalStock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }
    
    // Check current quantity in cart for this specific product+variant combination
    const currentItem = items.find(item => {
      if (variantId) {
        return item.product.id === product.id && item.variant?.id === variantId;
      }
      return item.product.id === product.id && !item.variant;
    });
    const currentQuantity = currentItem ? currentItem.quantity : 0;
    
    // Check if adding this quantity would exceed stock
    if (currentQuantity + quantity > totalStock) {
      const variantName = variantId && product.variants ? 
        product.variants.find(v => v.id === variantId)?.name : '';
      const itemName = variantName ? `${product.name} (${variantName})` : product.name;
      
      toast({
        title: "Insufficient Stock",
        description: `Only ${totalStock} items available for ${itemName}. You already have ${currentQuantity} in your cart.`,
        variant: "destructive",
      });
      return;
    }
    
    setAddingProducts(prev => new Set(prev).add(product.id));
    try {
      if (checkAuth()) {
        // User is authenticated, add to server
        await apiAddToCart(product.id, quantity, variantId);
        await initializeCart();
        
        const variantName = variantId && product.variants ? 
          product.variants.find(v => v.id === variantId)?.name : '';
        const itemName = variantName ? `${product.name} (${variantName})` : product.name;
        
        toast({
          title: "Success!",
          description: `${itemName} added to cart.`,
        });
      } else {
        // User is not authenticated, add to local storage
        // Add a small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const guestItems = getGuestCart();
        
        // Find existing item with same product and variant
        const existingItemIndex = guestItems.findIndex(item => {
          if (variantId) {
            return item.product.id === product.id && item.variant?.id === variantId;
          }
          return item.product.id === product.id && !item.variant;
        });
        
        // Calculate the correct price
        let finalPrice: number;
        if (variantId && product.variants) {
          const variant = product.variants.find(v => v.id === variantId);
          finalPrice = variant ? variant.price : (product.price || 0);
        } else {
          finalPrice = product.price || (product.variants && product.variants.length > 0 ? product.variants[0].price : 0);
        }
        
        const variantData = variantId && product.variants ? 
          product.variants.find(v => v.id === variantId) : undefined;
        
        if (existingItemIndex >= 0) {
          guestItems[existingItemIndex].quantity += quantity;
        } else {
          guestItems.push({
            id: Date.now(), // Temporary ID for guest cart
            product,
            variant: variantData,
            quantity,
            price: finalPrice,
            available_stock: getTotalStock(),
          });
        }
        
        setGuestCart(guestItems);
        updateLocalState(guestItems);
        
        const variantName = variantData?.name;
        const itemName = variantName ? `${product.name} (${variantName})` : product.name;
        
        toast({
          title: "Added to Cart",
          description: `${itemName} added to cart. Log in to save your cart.`,
        });
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        console.error("Failed to add to cart:", error);
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setAddingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    // Find the item to get product details for stock checking
    const item = items.find(item => item.id === itemId);
    if (!item) return;
    
    // Check stock if increasing quantity
    if (quantity > 0) {
      const getTotalStock = (): number => {
        if (item.product.stock !== undefined) {
          return item.product.stock;
        }
        if (item.product.variants && item.product.variants.length > 0) {
          return item.product.variants.reduce((total, variant) => total + variant.stock, 0);
        }
        return 0;
      };
      
      const totalStock = getTotalStock();
      
      if (quantity > totalStock) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${totalStock} items available for ${item.product.name}.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setLoading(true);
    try {
      if (checkAuth()) {
        // User is authenticated, update on server
        if (quantity <= 0) {
          await apiRemoveFromCart(itemId);
        } else {
          await apiUpdateCartItem(itemId, quantity);
        }
        await initializeCart();
      } else {
        // User is not authenticated, update local storage
        // Add a small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const guestItems = getGuestCart();
        if (quantity <= 0) {
          const filteredItems = guestItems.filter(item => item.id !== itemId);
          setGuestCart(filteredItems);
          updateLocalState(filteredItems);
        } else {
          const updatedItems = guestItems.map(item => 
            item.id === itemId ? { ...item, quantity } : item
          );
          setGuestCart(updatedItems);
          updateLocalState(updatedItems);
        }
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        console.error("Failed to update cart:", error);
        toast({
          title: "Error",
          description: "Failed to update cart. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    setLoading(true);
    try {
      if (checkAuth()) {
        // User is authenticated, remove from server
        await apiRemoveFromCart(itemId);
        await initializeCart();
        toast({
          title: "Item Removed",
          description: "Item has been removed from your cart.",
        });
      } else {
        // User is not authenticated, remove from local storage
        // Add a small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const guestItems = getGuestCart();
        const filteredItems = guestItems.filter(item => item.id !== itemId);
        setGuestCart(filteredItems);
        updateLocalState(filteredItems);
        toast({
          title: "Item Removed",
          description: "Item has been removed from your cart.",
        });
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        console.error("Failed to remove from cart:", error);
        toast({
          title: "Error",
          description: "Failed to remove item from cart. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (checkAuth()) {
        // User is authenticated, clear on server
        await apiClearCart();
        await initializeCart();
        toast({
          title: "Cart Cleared",
          description: "Your cart has been cleared.",
        });
      } else {
        // User is not authenticated, clear local storage
        // Add a small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 300));
        
        clearGuestCart();
        updateLocalState([]);
        toast({
          title: "Cart Cleared",
          description: "Your cart has been cleared.",
        });
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        console.error("Failed to clear cart:", error);
        toast({
          title: "Error",
          description: "Failed to clear cart. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isAddingToCart = (productId: number) => addingProducts.has(productId);

  // Check auth status on mount and when storage changes
  useEffect(() => {
    checkAuth();
    
    const handleStorage = () => {
      checkAuth();
    };
    
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [checkAuth]);

  return {
    items,
    totalItems,
    totalPrice,
    loading,
    isInitialized,
    isAddingToCart,
    isAuthenticated,
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