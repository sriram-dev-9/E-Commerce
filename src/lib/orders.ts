import { apiGet, apiPost, apiPut } from "@/lib/api";
import { Product } from "./products";

export type OrderItem = {
  id: number;
  product: Product;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  user: number; // or user object if populated
  shipping_address: string;
  total_amount: number;
  status: string; // e.g., "pending", "processing", "shipped", "delivered"
  created_at: string;
  updated_at: string;
  items: OrderItem[];
};

export async function createOrder(shippingAddress: string): Promise<Order> {
  return apiPost<Order>("/api/orders/create/", { shipping_address: shippingAddress });
}

export async function fetchOrders(): Promise<Order[]> {
  return apiGet<Order[]>("/api/orders/");
}

export async function fetchOrder(orderId: string): Promise<Order> {
  return apiGet<Order>(`/api/orders/${orderId}/`);
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  return apiPut<Order>(`/api/orders/${orderId}/update/`, { status });
}