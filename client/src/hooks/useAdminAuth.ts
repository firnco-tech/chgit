/**
 * ADMIN AUTHENTICATION HOOK
 * 
 * Centralized admin authentication state management
 * Handles authentication checks and redirects consistently
 */

import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  type: string;
}

export function useAdminAuth(redirectOnFailure: boolean = true) {
  const [, navigate] = useLocation();
  
  const { 
    data: adminUser, 
    isLoading, 
    error,
    refetch 
  } = useQuery<AdminUser>({
    queryKey: ["/api/admin/user"],
    retry: 1,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const isAuthenticated = !!adminUser && !error;
  
  useEffect(() => {
    if (redirectOnFailure && !isLoading && !isAuthenticated) {
      console.log('useAdminAuth: Redirecting to login - not authenticated');
      navigate('/admin/login');
    }
  }, [redirectOnFailure, isLoading, isAuthenticated, navigate]);

  return {
    adminUser,
    isLoading,
    error,
    isAuthenticated,
    refetch
  };
}