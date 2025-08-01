"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartContext } from "@/hooks/use-cart";
import { Plus, Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCartContext();
  const isLoading = isAddingToCart(product.id);
  
  const displayPrice = product.price || (product.variants && product.variants.length > 0 ? product.variants[0].price : 0);
  
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} className="block">
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            data-ai-hint={product.dataAiHint}
            width={600}
            height={600}
            className="w-full h-64 object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <CardTitle className="font-headline text-xl mb-2 hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mb-4">{product.description.substring(0, 100)}...</p>
        <p className="font-bold text-lg">₹{displayPrice}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => addToCart(product, 1)} 
          disabled={isLoading}
          className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
