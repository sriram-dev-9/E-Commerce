"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, getToken } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Calendar, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";

type OrderItem = {
  id: number;
  product: {
    id: number;
    name: string;
    image: string;
    slug: string;
  };
  quantity: number;
  price: string;
};

type Order = {
  id: number;
  status: string;
  total_amount: string;
  created_at: string;
  shipping_address: string;
  items: OrderItem[];
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  precessing: "bg-blue-100 text-blue-800", // Note: typo in Django model
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  precessing: "Processing", // Note: typo in Django model
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(""); // Clear any previous errors
        const data = await apiGet<Order[] | { results: Order[] } | any>("/api/orders/");
        console.log("Orders API response:", data); // Debug log
        console.log("Type of data:", typeof data); // Debug log
        console.log("Is array:", Array.isArray(data)); // Debug log
        
        // Handle both array responses and object responses with a results property
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && Array.isArray(data.results)) {
          setOrders(data.results);
        } else if (data && typeof data === 'object') {
          // If it's a single object, wrap it in an array
          setOrders([data]);
        } else {
          console.warn("Unexpected API response format:", data);
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
        setOrders([]); // Ensure orders is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h2 className="font-headline text-2xl mb-4">No Orders Yet</h2>
          <p className="text-muted-foreground mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.isArray(orders) && orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-headline text-xl">
                      Order #{order.id.toString().padStart(6, '0')}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        ₹{order.total_amount}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      statusColors[order.status] || statusColors.pending
                    } border-0`}
                  >
                    {statusLabels[order.status] || order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {order.shipping_address && (
                  <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Shipping Address:</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.shipping_address}
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <h3 className="font-medium">Items ({order.items.length})</h3>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="flex-grow">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-medium hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ₹{item.price}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
