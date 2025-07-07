/**
 * LANGUAGE SWITCHER COMPONENT
 * 
 * Visible language menu for all pages
 * Displays supported languages with flags and handles language switching
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  getCurrentLanguage,
  addLanguageToPath,
  getPathWithoutLanguage,
  saveLanguagePreference,
} from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

export function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const [, setLocation] = useLocation();
  const currentLanguage = getCurrentLanguage();
  const currentLangConfig = SUPPORTED_LANGUAGES[currentLanguage];

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    // Save preference
    saveLanguagePreference(newLanguage);
    
    // Get current path without language prefix
    const currentPath = getPathWithoutLanguage();
    
    // Create new path with language prefix
    const newPath = addLanguageToPath(currentPath, newLanguage);
    
    // Navigate to new path
    setLocation(newPath);
    
    // Update document language attribute
    document.documentElement.lang = newLanguage;
  };

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`gap-1 ${className}`}>
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">{currentLangConfig.flag}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`cursor-pointer ${
                currentLanguage === lang.code ? 'bg-accent' : ''
              }`}
            >
              <span className="mr-3 text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{lang.nativeName}</span>
                <span className="text-xs text-muted-foreground">{lang.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className}`}>
          <span className="text-lg">{currentLangConfig.flag}</span>
          <span className="hidden sm:inline font-medium">{currentLangConfig.nativeName}</span>
          <span className="sm:hidden font-medium">{currentLangConfig.code.toUpperCase()}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
          Choose Language
        </div>
        {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer flex items-center gap-3 py-2 ${
              currentLanguage === lang.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {currentLanguage === lang.code && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}