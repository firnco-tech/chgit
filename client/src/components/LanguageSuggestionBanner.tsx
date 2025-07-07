/**
 * LANGUAGE SUGGESTION BANNER
 * 
 * Non-intrusive banner suggesting language switch based on browser detection
 * Only shows for first-time visitors who haven't made a language choice
 */

import { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  shouldShowLanguageSuggestion, 
  dismissLanguageSuggestion, 
  navigateToLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage 
} from '@/lib/i18n';

export const LanguageSuggestionBanner = () => {
  const [suggestion, setSuggestion] = useState<{ show: boolean; suggestedLanguage?: SupportedLanguage }>({ show: false });

  useEffect(() => {
    // Check if we should show language suggestion
    const suggestionData = shouldShowLanguageSuggestion();
    setSuggestion(suggestionData);
  }, []);

  const handleAcceptSuggestion = () => {
    if (suggestion.suggestedLanguage) {
      navigateToLanguage(suggestion.suggestedLanguage);
    }
  };

  const handleDismiss = () => {
    dismissLanguageSuggestion();
    setSuggestion({ show: false });
  };

  if (!suggestion.show || !suggestion.suggestedLanguage) {
    return null;
  }

  const suggestedLang = SUPPORTED_LANGUAGES[suggestion.suggestedLanguage];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b border-blue-200 dark:border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                We detected your browser language is {suggestedLang.nativeName}.
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Would you like to switch to {suggestedLang.nativeName}?
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAcceptSuggestion}
              className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-950"
            >
              <span className="mr-1">{suggestedLang.flag}</span>
              Switch to {suggestedLang.nativeName}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};