'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Home, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderDetails {
  id: number;
  total_amount: string;
  items: Array<{
    product: {
      name: string;
      price: string;
    };
    quantity: number;
  }>;
  shipping_address: string;
  payment_status: string;
  razorpay_payment_id: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}/`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error || 'Order not found'}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Summary
            </CardTitle>
            <CardDescription>Order #{orderDetails.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Payment Status */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Status:</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                {orderDetails.payment_status}
              </Badge>
            </div>

            {/* Payment ID */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment ID:</span>
              <span className="text-sm text-gray-600 font-mono">
                {orderDetails.razorpay_payment_id}
              </span>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-green-600">₹{orderDetails.total_amount}</span>
            </div>

            {/* Shipping Address */}
            <div>
              <span className="font-medium">Shipping Address:</span>
              <p className="text-sm text-gray-600 mt-1 pl-4 border-l-2 border-gray-200">
                {orderDetails.shipping_address}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-medium">₹{item.product.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => router.push(`/track-order?order_id=${orderDetails.id}`)}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Package className="h-4 w-4" />
            Track Order
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700"
          >
            <Home className="h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You will receive an order confirmation email shortly</li>
            <li>• Your order will be processed within 1-2 business days</li>
            <li>• You can track your order status using the Track Order button above</li>
            <li>• Expected delivery: 3-7 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
