import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProducts } from '@/lib/products';
import { Leaf, ChefHat, Truck } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  const featuredProducts = getProducts().slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-primary mb-4">
            Pickle E-Commerce
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
            Authentic Indian pickles, spices, and culinary treasures, curated with passion and delivered to your doorstep.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>

      <section id="featured-products" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl text-center mb-10">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="recipe-ai" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="font-headline text-4xl mb-4">Unlock Culinary Creativity</h2>
              <p className="text-muted-foreground mb-6">
                Have a few ingredients but not sure what to make? Our AI-powered recipe tool suggests delicious Indian dishes you can create with our products and what you already have at home.
              </p>
              <Button asChild variant="secondary">
                <Link href="/recipes">Discover Recipes</Link>
              </Button>
            </div>
            <div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="A collection of spices and herbs"
                data-ai-hint="spices herbs"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl text-center mb-10">Why Choose Pickle E-Commerce?</h2>
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
