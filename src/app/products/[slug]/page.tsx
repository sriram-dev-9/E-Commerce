import React, { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { fetchProduct, type Product, type Review } from "@/lib/products";

function AddToCartSection({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg text-primary">₹{Number(product.price).toFixed(2)}</span>
        <div className="flex items-center border rounded-md">
          <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center">{quantity}</span>
          <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q+1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm">Stock: {product.stock}</span>
      </div>
      <Button onClick={() => addToCart(product, quantity)} size="lg" className="flex-grow">
        Add to Cart
      </Button>
    </div>
  );
}

export default AddToCartSection; 