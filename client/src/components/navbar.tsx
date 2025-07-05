import { Link, useLocation } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { CartSidebar } from "./cart-sidebar";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { getItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = getItemCount();

  const isActive = (path: string) => location === path;

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer">
                  HolaCupid
                </h1>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    Home
                  </span>
                </Link>
                <Link href="/browse">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/browse') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    Browse Profiles
                  </span>
                </Link>
                <Link href="/submit-profile">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/submit-profile') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    Submit Profile
                  </span>
                </Link>
                <Link href="/contact">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/contact') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    Contact
                  </span>
                </Link>
                <Link href="/help">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/help') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    Help
                  </span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
