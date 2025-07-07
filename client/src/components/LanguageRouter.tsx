/**
 * LANGUAGE ROUTER COMPONENT
 * 
 * Handles language prefix URL routing and automatic language detection
 */

import { Switch, Route, useLocation } from "wouter";
import { getCurrentLanguage, getPathWithoutLanguage, addLanguageToPath, DEFAULT_LANGUAGE } from '../lib/i18n';
import { useEffect, ReactNode } from 'react';

interface LanguageRouteProps {
  path: string;
  component: () => JSX.Element;
}

export const LanguageRoute = ({ path, component: Component }: LanguageRouteProps) => {
  const currentLanguage = getCurrentLanguage();
  
  // Create routes for both with and without language prefix
  const languageRoute = `/:lang${path}`;
  const defaultRoute = path;
  
  return (
    <>
      {/* Route with language prefix */}
      <Route path={languageRoute}>
        {(params) => {
          const { lang } = params;
          // Validate language and redirect if invalid
          if (!['en', 'es', 'it', 'de', 'nl', 'pt'].includes(lang)) {
            window.location.pathname = addLanguageToPath(path, currentLanguage);
            return null;
          }
          return <Component />;
        }}
      </Route>
      
      {/* Route without language prefix - redirect to language version */}
      <Route path={defaultRoute}>
        {() => {
          // Redirect to language-prefixed URL
          const languagePath = addLanguageToPath(path, currentLanguage);
          window.location.pathname = languagePath;
          return null;
        }}
      </Route>
    </>
  );
};

interface LanguageRouterProps {
  children: ReactNode;
}

export const LanguageRouter = ({ children }: LanguageRouterProps) => {
  const [location] = useLocation();
  
  useEffect(() => {
    // Update document language attribute
    const currentLang = getCurrentLanguage();
    document.documentElement.lang = currentLang;
  }, [location]);
  
  return <>{children}</>;
};

// Component to wrap the entire Switch for language handling
export const LanguageAwareSwitch = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageRouter>
      <Switch>
        {children}
      </Switch>
    </LanguageRouter>
  );
};