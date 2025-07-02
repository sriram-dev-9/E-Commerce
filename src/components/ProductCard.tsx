"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [variantIdx, setVariantIdx] = useState(0);
  const variant = product.variants[variantIdx];

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
      <CardFooter className="flex flex-col gap-2 items-start p-4">
        <Select value={variantIdx.toString()} onValueChange={val => setVariantIdx(Number(val))}>
          <SelectTrigger className="w-28">
            <SelectValue>{variant.qty}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {product.variants.map((v, idx) => (
              <SelectItem key={v.qty} value={idx.toString()}>{v.qty}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex w-full justify-between items-center">
          <p className="font-bold text-lg text-primary">₹{variant.price.toFixed(2)}</p>
          <Button onClick={() => addToCart({ ...product, variants: [variant] })} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
