import Link from 'next/link';
import { Twitter, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-headline text-xl text-primary mb-4">Pickle E-Commerce</h3>
            <p className="text-sm text-muted-foreground">Authentic Indian flavors, delivered to you.</p>
          </div>
          <div>
            <h4 className="font-headline text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=pickles" className="text-muted-foreground hover:text-primary">Pickles</Link></li>
              <li><Link href="/products?category=spices" className="text-muted-foreground hover:text-primary">Spices</Link></li>
              <li><Link href="/products?category=essentials" className="text-muted-foreground hover:text-primary">Essentials</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/recipes" className="text-muted-foreground hover:text-primary">Recipes</Link></li>
              <li><Link href="/track-order" className="text-muted-foreground hover:text-primary">Track Order</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pickle E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
