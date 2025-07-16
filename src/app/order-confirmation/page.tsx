"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { fetchOrder, Order } from '@/lib/orders';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

// This component will be wrapped in Suspense
function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      async function loadOrder() {
        try {
          const fetchedOrder = await fetchOrder(orderId!);
          setOrder(fetchedOrder);
        } catch (err) {
          console.error("Failed to fetch order:", err);
          setError("Failed to load order details.");
        } finally {
          setLoading(false);
        }
      }
      loadOrder();
    } else {
      setError("No order ID provided.");
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-destructive">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Order not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <Card className="max-w-3xl w-full p-8">
        <CardHeader className="text-center">
          <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-6" />
          <CardTitle className="font-headline text-3xl">Thank You For Your Order!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your order has been placed successfully. You will receive an email confirmation shortly.
          </p>
          <div className="text-left mb-6 space-y-2">
            <p className="text-lg font-semibold">Order ID: <span className="text-primary">#{order.id}</span></p>
            <p>Status: <span className="font-medium capitalize">{order.status}</span></p>
            <p>Total Amount: <span className="font-bold text-primary">₹{order.total_amount.toFixed(2)}</span></p>
            <p>Shipping Address: <span className="text-muted-foreground">{order.shipping_address}</span></p>
            <p>Order Date: <span className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span></p>
          </div>

          <Separator className="my-6" />

          <h3 className="font-headline text-2xl mb-4 text-left">Order Items</h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <Image src={item.product.image} alt={item.product.name} width={60} height={60} className="rounded-md" />
                <div className="flex-grow text-left">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  <p className="text-sm text-muted-foreground">₹{(item.price).toFixed(2)} each</p>
                </div>
                <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/track-order">Track All Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}