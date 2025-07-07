import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { useEffect } from "react";
import { initializeAnalytics } from "@/lib/analytics";
import Home from "@/pages/home";
import Browse from "@/pages/browse";
import ProfilePage from "@/pages/profile";
import SubmitProfile from "@/pages/submit-profile";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Help from "@/pages/help";
import Safety from "@/pages/safety";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/profile/:id" component={ProfilePage} />
      <Route path="/submit-profile" component={SubmitProfile} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/help" component={Help} />
      <Route path="/safety" component={Safety} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/cart" component={Cart} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/payment-success" component={PaymentSuccess} />
      
      {/* Admin Panel Routes - Isolated section */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/admins" component={AdminManagement} />
      <Route path="/admin/edit-profile/:id" component={AdminEditProfile} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize analytics on app load
  useEffect(() => {
    // Initialize analytics with Google Analytics ID (when available)
    // For now, initialize without GA to set up performance monitoring
    initializeAnalytics();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Router />
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
