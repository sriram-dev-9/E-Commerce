'use client';

import { useState, useEffect, Suspense } from 'react';
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

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const retryOrderId = searchParams.get('retry_order');
  const { items: cartItems, totalPrice: cartTotal, clearCart } = useCartContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Special handling for phone number
    if (name === 'phone') {
      // Remove any non-digit characters except +
      let cleanValue = value.replace(/[^\d+]/g, '');
      
      // Handle different input scenarios
      if (cleanValue.length === 0) {
        // Empty field
        setFormData(prev => ({ ...prev, [name]: '' }));
        return;
      }
      
      // If user starts with +91, keep it
      if (cleanValue.startsWith('+91')) {
        cleanValue = '+91' + cleanValue.substring(3).slice(0, 10);
      }
      // If user starts with 91 (without +), add +
      else if (cleanValue.startsWith('91') && cleanValue.length > 2) {
        cleanValue = '+91' + cleanValue.substring(2).slice(0, 10);
      }
      // If user starts with + but not +91, replace with +91
      else if (cleanValue.startsWith('+') && !cleanValue.startsWith('+91')) {
        cleanValue = '+91' + cleanValue.substring(1).slice(0, 10);
      }
      // If user enters 10 digits starting with 6-9, add +91
      else if (/^[6-9]\d{0,9}$/.test(cleanValue)) {
        cleanValue = cleanValue.slice(0, 10);
        // Only add +91 if we have a valid start
        if (cleanValue.length > 0) {
          cleanValue = '+91' + cleanValue;
        }
      }
      // For any other case, try to extract valid digits
      else {
        const digits = cleanValue.replace(/\D/g, '');
        if (digits.length > 0 && /^[6-9]/.test(digits)) {
          cleanValue = '+91' + digits.slice(0, 10);
        } else {
          cleanValue = value; // Keep original input if invalid
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
      return;
    }
    
    // Special handling for pincode - only digits
    if (name === 'pincode') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
      return;
    }
    
    // Regular handling for other fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newFieldErrors: Record<string, string> = {};
    let isValid = true;

    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        newFieldErrors[field] = `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
        isValid = false;
      }
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newFieldErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation - accept both +91 format and 10-digit format
    if (formData.phone) {
      const phoneValue = formData.phone.replace(/\s/g, ''); // Remove any spaces
      const phoneRegex10 = /^[6-9]\d{9}$/; // 10 digit starting with 6-9
      const phoneRegex91 = /^\+91[6-9]\d{9}$/; // +91 followed by 10 digits
      
      if (!phoneRegex10.test(phoneValue) && !phoneRegex91.test(phoneValue)) {
        newFieldErrors.phone = 'Please enter a valid phone number (10 digits starting with 6-9)';
        isValid = false;
      }
    }

    // Pincode validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newFieldErrors.pincode = 'Please enter a valid 6-digit pincode';
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    
    if (!isValid) {
      // Scroll to first error field
      const firstErrorField = Object.keys(newFieldErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      setError('Please fix the errors below and try again.');
    } else {
      setError(null);
    }

    return isValid;
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
                      className={fieldErrors.firstName ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {fieldErrors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={fieldErrors.lastName ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {fieldErrors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.lastName}</p>
                    )}
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
                    placeholder="support@andramrut.in"
                    className={fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}
                    required
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 6300 427 273"
                    className={`font-mono ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  {fieldErrors.phone ? (
                    <p className="text-sm text-red-600 mt-1">{fieldErrors.phone}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter 10 digits or +91 followed by 10 digits
                    </p>
                  )}
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
                    className={fieldErrors.address ? 'border-red-500 focus:border-red-500' : ''}
                    required
                  />
                  {fieldErrors.address && (
                    <p className="text-sm text-red-600 mt-1">{fieldErrors.address}</p>
                  )}
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
                      className={fieldErrors.city ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {fieldErrors.city && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={fieldErrors.state ? 'border-red-500 focus:border-red-500' : ''}
                      required
                    />
                    {fieldErrors.state && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="560001"
                      maxLength={6}
                      className={`font-mono ${fieldErrors.pincode ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                    {fieldErrors.pincode ? (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.pincode}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        6-digit area pincode
                      </p>
                    )}
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
                  If you continue to experience issues, please contact our support team.
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📧 support@andramrut.in</p>
                  <p>📞 +91 6300 427 273</p>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
