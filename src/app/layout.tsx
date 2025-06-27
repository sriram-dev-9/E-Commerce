import type { Metadata } from "next";
import { Belleza, Alegreya } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/toaster";

const belleza = Belleza({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-belleza",
});

const alegreya = Alegreya({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-alegreya",
});

export const metadata: Metadata = {
  title: "Pickle E-Commerce",
  description:
    "Authentic Indian pickles, spices, and more, delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${belleza.variable} ${alegreya.variable}`}>
      <body className="font-body antialiased">
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
