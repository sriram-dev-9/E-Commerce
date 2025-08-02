"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchProducts, Product } from '@/lib/products';
import { Leaf, ChefHat, Truck } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export default function Home() {
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

  let featuredProducts: Product[] = [];
  if (Array.isArray(products)) {
    featuredProducts = products.slice(0, 3);
  } else {
    featuredProducts = [];
  }

  return (
    <div className="flex flex-col">
      <section className="bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-primary mb-4">
            AndrAmrut Naturals
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
            Every Taste Has A Story - Authentic Indian pickles, spices, and culinary treasures, curated with passion and delivered to your doorstep.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>

      <section id="featured-products" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked favorites that capture the essence of authentic Indian flavors
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading delicious products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-destructive bg-red-50 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {/* View All Button */}
          {!loading && !error && featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline" className="font-medium">
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section id="why-us" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl text-center mb-10">Why Choose AndrAmrut Naturals?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Leaf className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-headline text-2xl mb-2">Authentic & Pure</h3>
                <p className="text-muted-foreground">We source the finest ingredients, ensuring every product is packed with traditional flavor and goodness.</p>
              </CardContent>
            </Card>
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <ChefHat className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-headline text-2xl mb-2">Curated Selection</h3>
                <p className="text-muted-foreground">Our range is carefully selected by culinary experts to bring you the best of Indian pantry staples.</p>
              </CardContent>
            </Card>
            <Card className="bg-transparent border-none shadow-none">
              <CardContent className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Truck className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-headline text-2xl mb-2">Fast & Fresh Delivery</h3>
                <p className="text-muted-foreground">We package with care and ship quickly, so your order arrives fresh and ready to enjoy.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
