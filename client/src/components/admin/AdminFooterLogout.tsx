/**
 * ADMIN FOOTER LOGOUT COMPONENT
 * 
 * Convenient red logout button placed at the bottom of admin pages
 * Provides easy access to logout functionality without interfering with navbar
 */

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogOut } from "lucide-react";

export function AdminFooterLogout() {
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/admin/logout', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      console.log('🔥 FOOTER LOGOUT SUCCESS - Clearing cache and redirecting');
      // Clear all cached data
      queryClient.clear();
      
      // Force reload to ensure clean state
      window.location.href = '/admin/login';
    },
    onError: (error) => {
      console.error('Footer logout error:', error);
      // Force navigation to login even if logout fails
      queryClient.clear();
      window.location.href = '/admin/login';
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="destructive"
        size="sm"
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg border-red-700"
      >
        <LogOut className="h-4 w-4 mr-2" />
        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  );
}