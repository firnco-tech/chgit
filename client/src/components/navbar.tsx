import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, User, LogOut, LogIn, Menu, ChevronDown, FileText, Mail, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { CartSidebar } from "./cart-sidebar";
import { AuthModal } from "./auth/AuthModal";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const { getItemCount } = useCart();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
                <a href="/#how-it-works">
                  <span className="px-3 py-2 rounded-md text-sm font-medium cursor-pointer text-gray-500 hover:text-primary">
                    How It Works
                  </span>
                </a>
                <Link href="/about">
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/about') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    About
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

            <div className="flex items-center space-x-2">
              {/* Cart Button */}
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
              
              {/* Desktop Authentication Section */}
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-primary">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{user?.username || user?.email}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/favorites" className="flex items-center gap-2 cursor-pointer">
                          <Heart className="h-4 w-4" />
                          <span>Favorites</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/submit-profile" className="flex items-center gap-2 cursor-pointer">
                          <FileText className="h-4 w-4" />
                          <span>Submit Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/contact" className="flex items-center gap-2 cursor-pointer">
                          <Mail className="h-4 w-4" />
                          <span>Contact</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex flex-col space-y-4 mt-6">
                      {/* User Info Section */}
                      {isAuthenticated && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="h-8 w-8 text-gray-600" />
                          <div>
                            <div className="font-medium text-sm">{user?.username || user?.email}</div>
                            <div className="text-xs text-gray-500">Logged in</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Navigation Links */}
                      <div className="space-y-1">
                        <Link href="/">
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive('/') ? 'bg-primary/10 text-primary' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Home
                          </Button>
                        </Link>
                        
                        <Link href="/browse">
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive('/browse') ? 'bg-primary/10 text-primary' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Browse Profiles
                          </Button>
                        </Link>
                        
                        {isAuthenticated ? (
                          <>
                            <Link href="/favorites">
                              <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/favorites') ? 'bg-primary/10 text-primary' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <Heart className="h-4 w-4 mr-2" />
                                Favorites
                              </Button>
                            </Link>
                            
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.location.href = '/#how-it-works';
                              }}
                            >
                              <HelpCircle className="h-4 w-4 mr-2" />
                              How It Works
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setShowAuthModal(true);
                            }}
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Favorites (Login Required)
                          </Button>
                        )}
                        
                        <Link href="/about">
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive('/about') ? 'bg-primary/10 text-primary' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            About
                          </Button>
                        </Link>
                        
                        <Link href="/contact">
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive('/contact') ? 'bg-primary/10 text-primary' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </Link>
                      </div>
                      
                      {/* Authentication Actions */}
                      <div className="pt-4 border-t">
                        {isAuthenticated ? (
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            disabled={isLoggingOut}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setShowAuthModal(true);
                            }}
                          >
                            <LogIn className="h-4 w-4 mr-2" />
                            Login
                          </Button>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
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
