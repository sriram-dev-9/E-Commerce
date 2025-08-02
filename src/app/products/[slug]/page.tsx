"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProduct, type Product, type Review, type Variant } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/hooks/use-cart";
import { Star, StarHalf, Minus, Plus, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImageUrl } from "@/lib/utils";

function AddToCartSection({ product }: { product: Product }) {
  const { addToCart, isAddingToCart } = useCartContext();
  const [variantIdx, setVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const hasVariants = product.variants && product.variants.length > 0;
  const variant = hasVariants ? product.variants[variantIdx] : undefined;
  const price = variant ? variant.price : product.price;
  const isLoading = isAddingToCart(product.id);
  
  // Calculate available stock
  const getAvailableStock = (): number => {
    if (hasVariants && variant) {
      return variant.stock;
    }
    if (product.stock !== undefined) {
      return product.stock;
    }
    return 0;
  };
  
  const availableStock = getAvailableStock();
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;
  const maxQuantity = Math.min(10, availableStock); // Cap at 10 or available stock

  const handleAddToCart = () => {
    if (!isOutOfStock && quantity <= availableStock) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="space-y-6">
      {hasVariants && (
        <div>
          <label className="text-sm font-medium mb-2 block">Variant</label>
          <Select value={String(variantIdx)} onValueChange={(value) => {
            setVariantIdx(parseInt(value));
            setQuantity(1); // Reset quantity when variant changes
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              {product.variants?.map((variant, idx) => (
                <SelectItem key={idx} value={String(idx)} disabled={variant.stock <= 0}>
                  {variant.name} - ₹{variant.price} 
                  {variant.stock <= 0 ? ' (Out of Stock)' : variant.stock <= 5 ? ` (${variant.stock} left)` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Stock Status */}
      <div className="space-y-2">
        {isOutOfStock ? (
          <div className="text-red-600 font-medium">Out of Stock</div>
        ) : isLowStock ? (
          <div className="text-orange-600 font-medium">Only {availableStock} left in stock</div>
        ) : (
          <div className="text-green-600 font-medium">{availableStock} in stock</div>
        )}
      </div>

      {!isOutOfStock && (
        <div>
          <label className="text-sm font-medium mb-2 block">Quantity</label>
          <div className="flex items-center border rounded-md w-32">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isLoading}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="flex-1 text-center">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={isLoading || quantity >= maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Max quantity: {maxQuantity}
          </div>
        </div>
      )}

      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
          ₹{price}
        </span>
        {/* Removed compareAtPrice check since it's not in the Variant type */}
      </div>

      {isOutOfStock ? (
        <Button 
          disabled 
          size="lg" 
          className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
        >
          Out of Stock
        </Button>
      ) : (
        <Button 
          onClick={handleAddToCart} 
          size="lg" 
          disabled={isLoading || quantity > availableStock}
          className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Adding to Cart...
            </>
          ) : (
            'Add to Cart'
          )}
        </Button>
      )}
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="fill-primary text-primary w-4 h-4" />
      ))}
      {hasHalfStar && <StarHalf className="fill-primary text-primary w-4 h-4" />}
      <span className="ml-2 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const productData = await fetchProduct(resolvedParams.slug);
        setProduct(productData);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-96 w-full mb-8"></div>
          <div className="bg-gray-300 h-8 w-3/4 mb-4"></div>
          <div className="bg-gray-300 h-4 w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground">{error || "The product you're looking for doesn't exist."}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div>
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto rounded-lg"
          />
        </div>
        
        <div>
          <h1 className="font-headline text-3xl md:text-4xl mb-4">{product.name}</h1>
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          {product.rating && (
            <div className="mb-6">
              <RatingStars rating={product.rating} />
            </div>
          )}
          
          <AddToCartSection product={product} />
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="font-headline text-2xl mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="border-b pb-6">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{review.user}</h3>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}