'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartContext } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CreditCard, MapPin, Shield, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { 
  createPaymentOrder, 
  initiateRazorpayPayment, 
  type CreatePaymentOrderResponse 
} from '@/lib/razorpay';
import { getToken } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const retryOrderId = searchParams.get('retry_order');
  const { items: cartItems, totalPrice: cartTotal, clearCart } = useCartContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  // Check if user is logged in and cart has items
  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to proceed with checkout.",
        variant: "destructive",
      });
      router.push('/login?redirect=/checkout');
      return;
    }

    // If no retry order and cart is empty, redirect to cart page
    if (!retryOrderId && cartItems.length === 0) {
      router.push('/cart');
      return;
    }
  }, [cartItems, router, retryOrderId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    // Pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setPaymentLoading(true);

    try {
      // Create shipping address string
      const shippingAddress = `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}, ${formData.country}. Phone: ${formData.phone}, Email: ${formData.email}`;

      // Create payment order
      const paymentOrder: CreatePaymentOrderResponse = await createPaymentOrder(shippingAddress);

      // Initiate Razorpay payment
      await initiateRazorpayPayment(
        paymentOrder,
        formData,
        (orderId: number) => {
          // Payment success
          clearCart();
          toast({
            title: "Payment Successful!",
            description: `Your order #${orderId} has been placed successfully.`,
          });
          router.push(`/payment-success?order_id=${orderId}`);
        },
        (error: string) => {
          // Payment failure
          toast({
            title: "Payment Failed",
            description: error,
            variant: "destructive",
          });
          router.push(`/payment-failure?error=payment_failed&order_id=${paymentOrder.order_id}`);
        }
      );

    } catch (error: any) {
      setError(error.message || 'Failed to initiate payment. Please try again.');
      toast({
        title: "Payment Error",
        description: error.message || 'Failed to initiate payment. Please try again.',
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // Loading state for empty cart
  if (!retryOrderId && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart to proceed with checkout</p>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-headline">
            {retryOrderId ? 'Complete Payment' : 'Checkout'}
          </h1>
          <p className="text-gray-600 mt-2">
            {retryOrderId ? 'Complete your pending payment' : 'Complete your order with secure payment'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Payment Security Notice */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Secure Payment</h3>
                    <p className="text-sm text-green-700">
                      Your payment is protected by Razorpay's bank-level security
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
                <CardDescription>
                  Enter your shipping details for delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address, apartment, suite, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">Razorpay Secure Payment</h4>
                      <p className="text-sm text-blue-700">
                        Credit/Debit Cards, Net Banking, UPI, Wallets
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="bg-white">Visa</Badge>
                    <Badge variant="outline" className="bg-white">Mastercard</Badge>
                    <Badge variant="outline" className="bg-white">RuPay</Badge>
                    <Badge variant="outline" className="bg-white">UPI</Badge>
                    <Badge variant="outline" className="bg-white">Net Banking</Badge>
                    <Badge variant="outline" className="bg-white">Wallets</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
                {retryOrderId && (
                  <CardDescription className="text-amber-600">
                    Completing payment for Order #{retryOrderId}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {!retryOrderId && cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Image src={item.product.image} alt={item.product.name} width={50} height={50} className="rounded-md" />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">₹{(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                {retryOrderId && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      Order details will be loaded from your pending order #{retryOrderId}
                    </p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST)</span>
                    <span>Included</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={paymentLoading}
                  size="lg"
                >
                  {paymentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay ₹{cartTotal.toFixed(2)}
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center mt-3">
                  By clicking "Pay", you agree to our Terms of Service and Privacy Policy.
                  Your payment information is encrypted and secure.
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-headline">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Estimated Delivery:</span>
                  <span className="text-sm font-medium">3-7 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Order Processing:</span>
                  <span className="text-sm font-medium">1-2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tracking:</span>
                  <span className="text-sm font-medium">Available after dispatch</span>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-headline">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Our customer support team is here to help
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📧 support@andramrut.in</p>
                  <p>📞 +91 XXX XXX XXXX</p>
                  <p>🕒 Mon-Fri, 9 AM - 6 PM IST</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
