"use client";

import Link from "next/link";
import { ShoppingCart, Menu, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { getToken, removeTokens, logout, apiGet } from "@/lib/api";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { totalItems, initializeCart } = useCartContext();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        setIsAuthenticated(true);
        try {
          // Get user profile information
          const userData = await apiGet('/api/users/profile/');
          setUser(userData);
          initializeCart(); // Initialize cart for authenticated users
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Token might be invalid, clear it
          removeTokens();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorage = () => {
      checkAuth();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [initializeCart]);

  const handleLogout = () => {
    removeTokens();
    setIsAuthenticated(false);
    setUser(null);
    
    // Sign out from Google if available
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-headline text-2xl text-primary">
          AndrAmrut Naturals
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/80 transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          {!loading && (
            <>
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <User className="h-5 w-5" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.first_name && user?.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="w-full">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button asChild size="sm">
                    <Link href="/login">Sign In / Sign Up</Link>
                  </Button>
                </div>
              )}
            </>
          )}

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
                  AndrAmrut Naturals
                </Link>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium" onClick={() => setSheetOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                
                {!loading && (
                  <>
                    {isAuthenticated && user ? (
                      <>
                        <div className="border-t pt-6">
                          <div className="mb-4">
                            <p className="text-sm font-medium">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}` 
                                : user.email?.split('@')[0]}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="flex flex-col gap-4">
                            <Link href="/profile" className="text-lg font-medium flex items-center gap-2" onClick={() => setSheetOpen(false)}>
                              <User className="h-4 w-4" />
                              Profile
                            </Link>
                            <Link href="/orders" className="text-lg font-medium flex items-center gap-2" onClick={() => setSheetOpen(false)}>
                              <Package className="h-4 w-4" />
                              My Orders
                            </Link>
                            <button onClick={() => { handleLogout(); setSheetOpen(false); }} className="text-lg font-medium text-destructive flex items-center gap-2">
                              <LogOut className="h-4 w-4" />
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="border-t pt-6 flex flex-col gap-4">
                        <Button asChild className="w-full" onClick={() => setSheetOpen(false)}>
                          <Link href="/login">Sign In / Sign Up</Link>
                        </Button>
                      </div>
                    )}
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
