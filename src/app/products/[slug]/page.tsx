"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProduct, type Product, type Review, type Variant } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/hooks/use-cart";
import { Star, StarHalf, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImageUrl } from "@/lib/utils";

function AddToCartSection({ product }: { product: Product }) {
  const { addToCart } = useCartContext();
  const [variantIdx, setVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const hasVariants = product.variants && product.variants.length > 0;
  const variant = hasVariants ? product.variants[variantIdx] : undefined;
  const price = variant ? variant.price : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="space-y-6">
      {hasVariants && (
        <div>
          <label className="text-sm font-medium mb-2 block">Variant</label>
          <Select value={String(variantIdx)} onValueChange={(value) => setVariantIdx(parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              {product.variants?.map((variant, idx) => (
                <SelectItem key={idx} value={String(idx)}>
                  {variant.name} - ₹{variant.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="text-sm font-medium mb-2 block">Quantity</label>
        <div className="flex items-center border rounded-md w-32">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="flex-1 text-center">{quantity}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">₹{price}</span>
        {/* Removed compareAtPrice check since it's not in the Variant type */}
      </div>

      <Button 
        onClick={handleAddToCart} 
        size="lg" 
        className="w-full bg-accent hover:bg-accent/90"
      >
        Add to Cart
      </Button>
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