"use client";

import Link from "next/link";
import { ShoppingBasket, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { getToken, removeToken } from "@/lib/api";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/track-order", label: "Track Order" },
];

export function Header() {
  const { cartCount } = useCart();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    // Listen for storage changes (e.g., logout in another tab)
    const handleStorage = () => setIsAuthenticated(!!getToken());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-headline text-2xl text-primary">
          Pickle E-Commerce
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/80 transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="text-foreground/80 transition-colors hover:text-foreground">Profile</Link>
              <button onClick={handleLogout} className="text-foreground/80 hover:text-destructive ml-2">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-foreground/80 transition-colors hover:text-foreground">Login</Link>
              <Link href="/register" className="text-foreground/80 transition-colors hover:text-foreground ml-2">Register</Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/cart">
              <ShoppingBasket className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-10">
                <Link href="/" className="font-headline text-2xl text-primary mb-4" onClick={() => setSheetOpen(false)}>
                  Pickle E-Commerce
                </Link>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium" onClick={() => setSheetOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" className="text-lg font-medium" onClick={() => setSheetOpen(false)}>Profile</Link>
                    <button onClick={() => { handleLogout(); setSheetOpen(false); }} className="text-lg font-medium text-destructive">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-lg font-medium" onClick={() => setSheetOpen(false)}>Login</Link>
                    <Link href="/register" className="text-lg font-medium" onClick={() => setSheetOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  );
}
