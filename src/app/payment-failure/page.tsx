'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, Home, RefreshCw, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const orderId = searchParams.get('order_id');
  
  const [retryLoading, setRetryLoading] = useState(false);

  const handleRetryPayment = async () => {
    if (!orderId) {
      router.push('/cart');
      return;
    }

    setRetryLoading(true);
    try {
      // Redirect back to checkout with the failed order
      router.push(`/checkout?retry_order=${orderId}`);
    } catch (error) {
      console.error('Failed to retry payment:', error);
      setRetryLoading(false);
    }
  };

  const errorMessages: { [key: string]: string } = {
    'payment_failed': 'Your payment could not be processed. Please try again.',
    'payment_cancelled': 'Payment was cancelled. Your order is still pending.',
    'insufficient_funds': 'Payment failed due to insufficient funds.',
    'card_declined': 'Your card was declined. Please try with a different payment method.',
    'network_error': 'Network error occurred during payment. Please try again.',
    'expired_session': 'Payment session expired. Please start the checkout process again.',
  };

  const getErrorMessage = (errorCode: string | null): string => {
    if (!errorCode) return 'Payment failed due to an unknown error.';
    return errorMessages[errorCode] || errorCode;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600">
            We couldn't process your payment. Don't worry, you can try again.
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-red-600">What went wrong?</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Solutions Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What can you do?</CardTitle>
            <CardDescription>
              Here are some solutions to complete your purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Try a different payment method</h4>
                  <p className="text-sm text-gray-600">
                    Use a different card or payment option
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Retry the payment</h4>
                  <p className="text-sm text-gray-600">
                    Sometimes temporary issues resolve themselves
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Start over</h4>
                  <p className="text-sm text-gray-600">
                    Go back to your cart and try again
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {orderId && (
            <Button
              onClick={handleRetryPayment}
              disabled={retryLoading}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
            >
              {retryLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Retry Payment
                </>
              )}
            </Button>
          )}
          
          <Button
            onClick={() => router.push('/cart')}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Cart
          </Button>
        </div>

        {/* Help Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">
            If you continue to experience issues, please contact our support team.
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>• Email: support@andramrut.in</p>
            <p>• Phone: +91 XXX XXX XXXX</p>
            <p>• Available: Mon-Fri, 9 AM - 6 PM IST</p>
          </div>
        </div>

        {/* Order Information */}
        {orderId && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Order Information</h3>
            <p className="text-sm text-blue-800">
              Your order #{orderId} is still pending. You can complete the payment 
              anytime by clicking the "Retry Payment" button above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
}
