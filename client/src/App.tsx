import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import Home from "@/pages/home";
import Browse from "@/pages/browse";
import ProfilePage from "@/pages/profile";
import SubmitProfile from "@/pages/submit-profile";
import Contact from "@/pages/contact";
import Help from "@/pages/help";
import Safety from "@/pages/safety";
import Checkout from "@/pages/checkout";
import Cart from "@/pages/cart";
import NotFound from "@/pages/not-found";

// Admin Panel Components - Isolated from main site
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminEditProfile from "@/pages/admin/AdminEditProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/profile/:id" component={ProfilePage} />
      <Route path="/submit-profile" component={SubmitProfile} />
      <Route path="/contact" component={Contact} />
      <Route path="/help" component={Help} />
      <Route path="/safety" component={Safety} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/cart" component={Cart} />
      
      {/* Admin Panel Routes - Isolated section */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/edit-profile/:id" component={AdminEditProfile} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
