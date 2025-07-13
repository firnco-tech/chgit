import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, User, LogOut, LogIn, Menu, ChevronDown, FileText, Mail, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
// Cart sidebar removed - now using dedicated cart page
import { AuthModal } from "./auth/AuthModal";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { addLanguageToPath, getCurrentLanguage } from "@/lib/i18n";
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
  const [location, setLocation] = useLocation();
  const { getItemCount } = useCart();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();
  // Cart sidebar removed - now using cart page
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();

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
                <Link href={addLanguageToPath('/', currentLanguage)}>
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    {t.home}
                  </span>
                </Link>
                <Link href={addLanguageToPath('/browse', currentLanguage)}>
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/browse') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    {t.browse}
                  </span>
                </Link>
                <a href={`${addLanguageToPath('/', currentLanguage)}#how-it-works`}>
                  <span className="px-3 py-2 rounded-md text-sm font-medium cursor-pointer text-gray-500 hover:text-primary">
                    {t.howItWorks}
                  </span>
                </a>
                <Link href={addLanguageToPath('/about', currentLanguage)}>
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/about') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    {t.about}
                  </span>
                </Link>
                <Link href={addLanguageToPath('/contact', currentLanguage)}>
                  <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActive('/contact') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                  }`}>
                    {t.contact}
                  </span>
                </Link>
                {isAuthenticated ? (
                  <Link href={addLanguageToPath('/favorites', currentLanguage)}>
                    <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer flex items-center gap-1 ${
                      isActive('/favorites') ? 'text-primary' : 'text-gray-500 hover:text-primary'
                    }`}>
                      <Heart className="h-4 w-4" />
                      {t.favorites}
                    </span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="px-3 py-2 rounded-md text-sm font-medium cursor-pointer text-gray-500 hover:text-primary flex items-center gap-1"
                  >
                    <Heart className="h-4 w-4" />
                    {t.favorites}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <LanguageSwitcher variant="minimal" />
              
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation(addLanguageToPath('/cart', currentLanguage))}
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
                        <Link href={addLanguageToPath('/favorites', currentLanguage)} className="flex items-center gap-2 cursor-pointer">
                          <Heart className="h-4 w-4" />
                          <span>{t.favorites}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={addLanguageToPath('/submit-profile', currentLanguage)} className="flex items-center gap-2 cursor-pointer">
                          <FileText className="h-4 w-4" />
                          <span>Submit Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={addLanguageToPath('/contact', currentLanguage)} className="flex items-center gap-2 cursor-pointer">
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
                        <Link href={addLanguageToPath('/', currentLanguage)}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive('/') ? 'bg-primary/10 text-primary' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {t.home}
                          </Button>
                        </Link>
                        
                        <Link href={addLanguageToPath('/browse', currentLanguage)}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive('/browse') ? 'bg-primary/10 text-primary' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {t.browse}
                          </Button>
                        </Link>
                        
                        {isAuthenticated ? (
                          <>
                            <Link href={addLanguageToPath('/favorites', currentLanguage)}>
                              <Button 
                                variant="ghost" 
                                className={`w-full justify-start ${isActive('/favorites') ? 'bg-primary/10 text-primary' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <Heart className="h-4 w-4 mr-2" />
                                {t.favorites}
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
                            {t.favorites} (Login Required)
                          </Button>
                        )}
                        
                        <Link href={addLanguageToPath('/about', currentLanguage)}>
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start ${isActive('/about') ? 'bg-primary/10 text-primary' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            About
                          </Button>
                        </Link>
                        
                        <Link href={addLanguageToPath('/contact', currentLanguage)}>
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
                      
                      {/* Mobile Language Switcher */}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between px-2 py-2">
                          <span className="text-sm font-medium text-gray-700">Language</span>
                          <LanguageSwitcher variant="default" className="flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart sidebar removed - now using dedicated cart page */}
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        trigger="general"
      />
    </>
  );
}
