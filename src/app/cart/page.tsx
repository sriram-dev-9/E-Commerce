"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBasket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/utils";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, initializeCart, isInitialized } = useCartContext();

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  if (!isInitialized) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading cart...</div>;
  }

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBasket className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="font-headline text-4xl mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline text-4xl mb-8">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                  <Image
                    src={getImageUrl(item.product.image)}
                    alt={item.product.name}
                    data-ai-hint={item.product.dataAiHint}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                  <div className="flex-grow">
                    <Link href={`/products/${item.product.slug}`}>
                      <h2 className="font-headline text-lg hover:text-primary">{item.product.name}</h2>
                    </Link>
                    <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-bold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
