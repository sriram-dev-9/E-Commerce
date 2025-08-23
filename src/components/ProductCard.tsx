"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartContext } from "@/hooks/use-cart";
import { Plus, Loader2, ShoppingCart } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

// Helper function to get category name
const getCategoryName = (category: Product['category']): string => {
  return typeof category === 'object' ? category.name : '';
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCartContext();
  const router = useRouter();
  const isLoading = isAddingToCart(product.id);
  
  // In variants-only system, all products have variants
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  
  // Use the price_range from backend or calculate from variants
  const displayPrice = product.price_range || `₹${product.effective_price}`;
  
  // Use total_stock from backend
  const totalStock = product.total_stock || 0;
  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;
  
  // For multi-variant products, navigate to product page; for single variant, add directly
  const handleAddToCart = () => {
    if (hasMultipleVariants) {
      // Navigate to product page for variant selection using Next.js router
      router.push(`/products/${product.slug}`);
    } else {
      // Single variant product, add directly to cart with the variant
      const variant = product.variants[0];
      addToCart(product, 1, variant);
    }
  };
  
  return (
    <Card className="group relative overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-xl">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-white rounded-t-xl">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="aspect-square relative">
            <Image
              src={getImageUrl(product.image)}
              alt={product.name}
              data-ai-hint={product.dataAiHint}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105 p-4"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={95}
              priority={false}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-t-xl" />
          </div>
        </Link>
        
        {/* Quick add button - shows on hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md"
            onClick={handleAddToCart}
            disabled={isLoading || isOutOfStock}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : hasMultipleVariants ? (
              <ShoppingCart className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Sale/New Badge */}
        {product.category && getCategoryName(product.category) && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-primary text-primary-foreground font-medium"
          >
            {getCategoryName(product.category)}
          </Badge>
        )}
        
        {/* Stock Status Badge */}
        {isOutOfStock && (
          <Badge 
            variant="destructive" 
            className="absolute bottom-3 left-3 bg-red-600 text-white font-medium"
          >
            Out of Stock
          </Badge>
        )}
        {isLowStock && !isOutOfStock && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-3 left-3 bg-orange-500 text-white font-medium"
          >
            Only {totalStock} left
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        {/* Product Info */}
        <div className="space-y-3">
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-headline text-lg font-semibold text-gray-900 hover:text-primary transition-colors duration-200 line-clamp-2 min-h-[3.5rem]">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {product.description}
          </p>

          {/* Price and Stock Info */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                {displayPrice}
              </span>
              {!hasMultipleVariants && product.variants && product.variants.length === 1 && product.variants[0].price > 100 && (
                <span className="text-sm text-gray-500 line-through">₹{Math.round(product.variants[0].price * 1.2)}</span>
              )}
            </div>
            {!isOutOfStock && totalStock <= 10 && (
              <span className="text-xs text-orange-600 font-medium">
                {totalStock} in stock
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {isOutOfStock ? (
            <Button 
              disabled
              className="w-full mt-4 bg-gray-300 text-gray-500 cursor-not-allowed font-medium py-2.5 rounded-lg"
            >
              Out of Stock
            </Button>
          ) : (
            <Button 
              onClick={handleAddToCart} 
              disabled={isLoading}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : hasMultipleVariants ? (
                'Select Options'
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
