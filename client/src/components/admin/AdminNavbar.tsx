/**
 * ADMIN PANEL COMPONENT - Isolated from main site
 * 
 * AdminNavbar.tsx - Navigation component for admin panel
 * This component provides navigation within the admin panel section
 */

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Settings, 
  Users, 
  FileText, 
  ShoppingCart, 
  BarChart3, 
  Shield,
  LogOut,
  Home
} from "lucide-react";

export function AdminNavbar() {
  const [location, navigate] = useLocation();

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/admin/logout', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      // Clear all admin-related cache
      queryClient.invalidateQueries({ queryKey: ['/api/admin'] });
      queryClient.clear();
      
      // Navigate to login page
      navigate('/admin/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Force navigation to login even if logout fails
      navigate('/admin/login');
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/profiles", label: "Profiles", icon: FileText },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/admin">
            <div className="flex items-center space-x-2 text-xl font-bold">
              <Shield className="h-6 w-6" />
              <span>Admin Panel</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      isActive 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Site
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </nav>
  );
}