import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { CartSidebar } from "./cart-sidebar";
import { AuthModal } from "./auth/AuthModal";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { getItemCount } = useCart();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const itemCount = getItemCount();

  const isActive = (path: string) => location === path;
  
  const handleLogout = () => {
    logout();
  };

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
                {isAuthenticated ? (
                  <Link href="/favorites">
                    <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer flex items-center gap-1 ${
                      isActive('/favorites') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                    }`}>
                      <Heart className="h-4 w-4" />
                      Favorites
                    </span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="px-3 py-2 rounded-md text-sm font-medium cursor-pointer text-gray-500 hover:text-primary flex items-center gap-1"
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </button>
                )}
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
              
              {/* Authentication Section */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {user?.username || user?.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-gray-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="text-gray-500 hover:text-primary flex items-center gap-1"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        trigger="general"
      />
    </>
  );
}
