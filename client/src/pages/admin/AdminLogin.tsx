/**
 * ADMIN LOGIN PAGE - Secure authentication for admin panel access
 * 
 * This component provides authentication for admin and super admin users
 * Redirects to appropriate dashboard after successful login
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Lock, User } from "lucide-react";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'superadmin';
  };
}

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string>('');

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      console.log('Sending login request:', data);
      const response = await apiRequest('/api/admin/login', {
        method: 'POST',
        body: data
      });
      console.log('Login response received:', response);
      const jsonData = await response.json();
      console.log('Login JSON data:', jsonData);
      return jsonData;
    },
    onSuccess: (response) => {
      console.log('Login onSuccess called with:', response);
      if (response.success) {
        console.log('Login successful, forcing navigation to /admin');
        // Force redirect to admin dashboard
        window.location.href = '/admin';
      } else {
        console.log('Login response indicates failure');
        setError('Login failed. Please check your credentials.');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      console.error('Error details:', JSON.stringify(error));
      setError(error.message || 'Login failed. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    loginMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Panel Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the administration panel
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="mt-1 relative">
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      className="pl-10"
                    />
                    <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="pl-10"
                    />
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secure access to HolaCupid administration panel
          </p>
        </div>
      </div>
    </div>
  );
}