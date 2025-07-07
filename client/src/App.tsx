import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { LanguageSuggestionBanner } from "@/components/LanguageSuggestionBanner";
import { getBestLanguageForUser, addLanguageToPath } from "@/lib/i18n";
import { useEffect } from "react";
import Analytics from "@/components/Analytics";
import { initializeAnalytics } from "@/lib/analytics";
import Home from "@/pages/home";
import Browse from "@/pages/browse";
import ProfilePage from "@/pages/profile";
import SubmitProfile from "@/pages/submit-profile";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Help from "@/pages/help";
import Safety from "@/pages/safety";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Cookies from "@/pages/cookies";
import Disclaimer from "@/pages/disclaimer";
import Report from "@/pages/report";
import Checkout from "@/pages/checkout";
import Cart from "@/pages/cart";
import Favorites from "@/pages/favorites";
import PaymentSuccess from "@/pages/payment-success";
import NotFound from "@/pages/not-found";

// Admin Panel Components - Isolated from main site
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminEditProfile from "@/pages/admin/AdminEditProfile";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminManagement from "@/pages/admin/AdminManagement";

// Admin Route Wrapper - No main site layout for admin routes
function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/admins" component={AdminManagement} />
      <Route path="/admin/edit-profile/:id" component={AdminEditProfile} />
      <Route path="/admin/*" component={AdminDashboard} />
    </Switch>
  );
}

// Main Site Router - With main site layout
function MainSiteRouter() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Analytics />
      <LanguageSuggestionBanner />
      <Navbar />
      <main className="flex-1">
        <Switch>
          {/* Language-prefixed routes */}
          <Route path="/:lang" component={Home} />
          <Route path="/:lang/browse" component={Browse} />
          <Route path="/:lang/profile/:slug" component={ProfilePage} />
          <Route path="/:lang/submit-profile" component={SubmitProfile} />
          <Route path="/:lang/about" component={About} />
          <Route path="/:lang/contact" component={Contact} />
          <Route path="/:lang/help" component={Help} />
          <Route path="/:lang/safety" component={Safety} />
          <Route path="/:lang/privacy" component={Privacy} />
          <Route path="/:lang/terms" component={Terms} />
          <Route path="/:lang/cookies" component={Cookies} />
          <Route path="/:lang/disclaimer" component={Disclaimer} />
          <Route path="/:lang/report" component={Report} />
          <Route path="/:lang/checkout" component={Checkout} />
          <Route path="/:lang/cart" component={Cart} />
          <Route path="/:lang/favorites" component={Favorites} />
          <Route path="/:lang/payment-success" component={PaymentSuccess} />
          
          {/* Default routes without language prefix - redirect to language version */}
          <Route path="/" component={() => <RedirectToLanguage path="/" />} />
          <Route path="/browse" component={() => <RedirectToLanguage path="/browse" />} />
          <Route path="/profile/:slug" component={(params: any) => <RedirectToLanguage path={`/profile/${params.slug}`} />} />
          <Route path="/submit-profile" component={() => <RedirectToLanguage path="/submit-profile" />} />
          <Route path="/about" component={() => <RedirectToLanguage path="/about" />} />
          <Route path="/contact" component={() => <RedirectToLanguage path="/contact" />} />
          <Route path="/help" component={() => <RedirectToLanguage path="/help" />} />
          <Route path="/safety" component={() => <RedirectToLanguage path="/safety" />} />
          <Route path="/privacy" component={() => <RedirectToLanguage path="/privacy" />} />
          <Route path="/terms" component={() => <RedirectToLanguage path="/terms" />} />
          <Route path="/cookies" component={() => <RedirectToLanguage path="/cookies" />} />
          <Route path="/disclaimer" component={() => <RedirectToLanguage path="/disclaimer" />} />
          <Route path="/report" component={() => <RedirectToLanguage path="/report" />} />
          <Route path="/checkout" component={() => <RedirectToLanguage path="/checkout" />} />
          <Route path="/cart" component={() => <RedirectToLanguage path="/cart" />} />
          <Route path="/favorites" component={() => <RedirectToLanguage path="/favorites" />} />
          <Route path="/payment-success" component={() => <RedirectToLanguage path="/payment-success" />} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin routes - separate layout */}
      <Route path="/admin*" component={AdminRoutes} />
      {/* All other routes - main site layout */}
      <Route component={MainSiteRouter} />
    </Switch>
  );
}

// Component to redirect to language-prefixed version
function RedirectToLanguage({ path }: { path: string }) {
  useEffect(() => {
    const bestLanguage = getBestLanguageForUser();
    const newPath = addLanguageToPath(path, bestLanguage);
    window.history.replaceState({}, '', newPath);
    window.location.reload();
  }, [path]);
  
  return null;
}

function App() {
  useEffect(() => {
    // Initialize analytics on app load
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId) {
      initializeAnalytics(gaId);
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
