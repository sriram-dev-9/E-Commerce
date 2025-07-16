"use client";
import { useEffect, useState } from "react";
import { fetchProducts, Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray((data as any).results)) {
          setProducts((data as any).results);
        } else {
          setProducts([]);
          setError("Unexpected products response shape.");
        }
      })
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading products...</div>;
  }
  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl mb-2">Our Collection</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our handpicked selection of authentic Indian pickles, spices, and essentials. Each product is a promise of quality and tradition.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
