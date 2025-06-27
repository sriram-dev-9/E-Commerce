import { getProducts, Product } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

export default function ProductsPage() {
  const products = getProducts();

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
