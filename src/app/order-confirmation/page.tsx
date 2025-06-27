import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <Card className="max-w-lg w-full text-center p-8">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-6" />
          <CardTitle className="font-headline text-3xl">Thank You For Your Order!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your order has been placed successfully. You will receive an email confirmation shortly.
            Your mock order ID is <span className="font-bold text-primary">MM-12345</span>.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/track-order">Track Your Order</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
