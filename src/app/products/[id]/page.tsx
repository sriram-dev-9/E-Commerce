"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProduct, type Product, type Review } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Star, StarHalf, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function AddToCartSection({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [variantIdx, setVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const variant = product.variants[variantIdx];

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-4">
        <Select value={variantIdx.toString()} onValueChange={val => setVariantIdx(Number(val))}>
          <SelectTrigger className="w-32">
            <SelectValue>{variant.qty}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {product.variants.map((v, idx) => (
              <SelectItem key={v.qty} value={idx.toString()}>{v.qty}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-md">
          <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center">{quantity}</span>
          <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q+1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="font-bold text-lg text-primary">₹{variant.price.toFixed(2)}</span>
      </div>
      <Button onClick={() => addToCart({ ...product, variants: [variant] }, quantity)} size="lg" className="flex-grow">
        Add to Cart
      </Button>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        if (ratingValue <= rating) {
          return <Star key={i} className="h-5 w-5 text-primary fill-primary" />;
        }
        if (ratingValue - 0.5 <= rating) {
          return <StarHalf key={i} className="h-5 w-5 text-primary fill-primary" />;
        }
        return <Star key={i} className="h-5 w-5 text-muted" />;
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="border-b py-6">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">{review.author}</h4>
                <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <StarRating rating={review.rating} />
                <p className="font-headline text-lg">{review.title}</p>
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
        </div>
    )
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    const fetchedProduct = getProduct(params.id);
    setProduct(fetchedProduct);
  }, [params.id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            data-ai-hint={product.dataAiHint}
            width={800}
            height={800}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="font-headline text-4xl lg:text-5xl mb-4">{product.name}</h1>
          <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
          
          <AddToCartSection product={product} />
        </div>
      </div>
      <Separator className="my-12" />
      <div>
        <h2 className="font-headline text-3xl mb-6">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div>
            {product.reviews.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        ) : (
          <p className="text-muted-foreground">This product has no reviews yet.</p>
        )}
      </div>
    </div>
  );
}
