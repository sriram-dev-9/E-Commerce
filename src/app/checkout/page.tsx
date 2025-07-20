"use client";

import { useCartContext } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/lib/orders";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api";

export default function CheckoutPage() {
  const { items: cartItems, totalPrice: cartTotal, clearCart } = useCartContext();
  const router = useRouter();
  const { toast } = useToast();
  const shippingCost = 50.00;

  const [shippingAddress, setShippingAddress] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (typeof window !== 'undefined' && cartItems.length === 0) {
      router.push('/');
    }
    
    // Redirect if user is not authenticated
    if (typeof window !== 'undefined' && !getToken()) {
      toast({
        title: "Authentication Required",
        description: "Please login to proceed with checkout.",
        variant: "destructive",
      });
      router.push('/login?redirect=checkout');
    }
  }, [cartItems, router, toast]);

  if (cartItems.length === 0) {
    return null;
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullAddress = `${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddress.email}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}, ${shippingAddress.country}`;

    try {
      const order = await createOrder(fullAddress);
      toast({
        title: "Order Placed!",
        description: `Your order #${order.id} has been placed successfully.`,
      });
      clearCart();
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch (error: any) {
      console.error("Order creation failed:", error);
      console.error("Backend error response:", error.response?.data);
      toast({
        title: "Order Failed",
        description: error.response?.data?.detail || "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline text-4xl text-center mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required value={shippingAddress.email} onChange={handleAddressChange} />
                </div>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required value={shippingAddress.firstName} onChange={handleAddressChange} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required value={shippingAddress.lastName} onChange={handleAddressChange} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Spice Lane" required value={shippingAddress.address} onChange={handleAddressChange} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New Delhi" required value={shippingAddress.city} onChange={handleAddressChange} />
                </div>
                <div>
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" placeholder="Delhi" required value={shippingAddress.state} onChange={handleAddressChange} />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP / Postal Code</Label>
                  <Input id="zip" placeholder="110001" required value={shippingAddress.zip} onChange={handleAddressChange} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="India" required value={shippingAddress.country} onChange={handleAddressChange} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="**** **** **** 1234" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" placeholder="MM / YY" required />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Image src={item.product.image} alt={item.product.name} width={50} height={50} className="rounded-md" />
                            <div>
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p>₹{(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹{shippingCost.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{(cartTotal + shippingCost).toFixed(2)}</span>
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full mt-6 bg-accent hover:bg-accent/90">
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
