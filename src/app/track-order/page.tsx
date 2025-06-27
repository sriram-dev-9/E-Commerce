"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'not_found';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<OrderStatus>('pending');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim().toUpperCase() === 'MM-12345') {
      setStatus('shipped');
    } else if (orderId.trim() === '') {
        setStatus('pending');
    }
    else {
      setStatus('not_found');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <form onSubmit={handleTrackOrder}>
            <CardHeader className="text-center">
              <Truck className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle className="font-headline text-3xl">Track Your Order</CardTitle>
              <CardDescription>Enter your order ID below to see its status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  placeholder="e.g., MM-12345"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Track Order</Button>
            </CardFooter>
          </form>
        </Card>

        {status !== 'pending' && (
          <Card className="mt-8">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              {status === 'not_found' && (
                <p className="text-destructive">Order not found. Please check the ID and try again.</p>
              )}
              {status === 'shipped' && (
                <div>
                  <p className="mb-2"><strong>Order ID:</strong> MM-12345</p>
                  <p className="mb-4"><strong>Status:</strong> Shipped</p>
                  <div className="relative">
                    <div className="h-2 bg-muted rounded-full"/>
                    <div className="absolute top-0 h-2 bg-primary rounded-full" style={{width: '66%'}}/>
                  </div>
                  <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
