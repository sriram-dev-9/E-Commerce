import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-headline text-xl text-primary mb-4">AndrAmrut Naturals</h3>
            <p className="text-sm text-muted-foreground">Every Taste Has A Story - Authentic Indian regional flavors, delivered to you.</p>
            
            {/* Social Media Links - Commented out for now */}
            {/* <div className="mt-4">
              <h4 className="font-headline text-sm mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
              </div>
            </div> */}
          </div>
          <div>
            <h4 className="font-headline text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">View Shop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">Email:</span><br/>
                <a href="mailto:support@andramrut.in" className="hover:text-primary">support@andramrut.in</a>
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Phone:</span><br/>
                <a href="tel:+916300427273" className="hover:text-primary">+91 6300 427 273</a>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6">
          {/* FSSAI License Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Image
                src="/fssai_logo.png"
                alt="FSSAI Logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-foreground">FSSAI Licensed</p>
                <p className="text-xs text-muted-foreground">License No: 20125091000421</p>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AndrAmrut Naturals. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
