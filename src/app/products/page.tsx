import { getProducts, Product } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

export default function ProductsPage() {
  const products = getProducts();
  const vegPickles = products.filter((p: Product) => p.subcategory === 'veg');
  const nonVegPickles = products.filter((p: Product) => p.subcategory === 'nonveg');
  const podulu = products.filter((p: Product) => p.subcategory === 'podulu');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl mb-2">Our Collection</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our handpicked selection of authentic Indian pickles, spices, and essentials. Each product is a promise of quality and tradition.
        </p>
      </div>

      <h2 className="font-headline text-3xl mb-6">Vegetarian Pickles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
        {vegPickles.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <h2 className="font-headline text-3xl mb-6">Non-Veg Pickles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
        {nonVegPickles.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <h2 className="font-headline text-3xl mb-6">Podulu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {podulu.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
