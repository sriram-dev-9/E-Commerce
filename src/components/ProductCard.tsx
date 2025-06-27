"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <Image
            src={product.image}
            alt={product.name}
            data-ai-hint={product.dataAiHint}
            width={600}
            height={600}
            className="w-full h-64 object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="font-headline text-xl mb-2 hover:text-primary transition-colors">{product.name}</CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground">{product.description.substring(0, 100)}...</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <p className="font-bold text-lg text-primary">₹{product.price.toFixed(2)}</p>
        <Button onClick={() => addToCart(product)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
