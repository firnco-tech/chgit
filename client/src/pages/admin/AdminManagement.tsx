/**
 * ADMIN MANAGEMENT PAGE - SUPER ADMIN ONLY
 * 
 * This page allows super admins to manage admin accounts:
 * - View all admin users with their roles, names, emails, last login
 * - Create new standard admin accounts 
 * - Change roles of existing admins (promote/demote)
 * - Deactivate, reactivate, or delete admin accounts
 * - All actions are fully auditable and logged
 * 
 * Access Control: Only authenticated super admins can access this page
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminFooterLogout } from "@/components/admin/AdminFooterLogout";

// Icons
import { Plus, Edit, Trash2, Shield, ShieldCheck, UserX, UserCheck, Search } from "lucide-react";

// Types
interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// Form Schemas
const createAdminSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "superadmin"], { required_error: "Please select a role" })
});

const editAdminSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "superadmin"], { required_error: "Please select a role" }),
  isActive: z.boolean()
});

type CreateAdminForm = z.infer<typeof createAdminSchema>;
type EditAdminForm = z.infer<typeof editAdminSchema>;

export default function AdminManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Check if current user is super admin (page-level protection)
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ["/api/admin/user"],
    retry: false,
  });

  // Redirect to login if not authenticated or not super admin
  useEffect(() => {
    if (!userLoading && (!currentUser || currentUser.role !== 'superadmin')) {
      toast({
        title: "Access Denied",
        description: "Super admin privileges required. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 2000);
      return;
    }
  }, [currentUser, userLoading, toast]);

  // Fetch all admin users
  const { data: adminUsers = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/admins"],
    enabled: currentUser?.role === 'superadmin',
  });

  // Create admin mutation
  const createAdminMutation = useMutation({
    mutationFn: async (data: CreateAdminForm) => {
      return await apiRequest("/api/admin/admins", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Admin Created",
        description: "New admin account has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admins"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account.",
        variant: "destructive",
      });
    },
  });

  // Update admin mutation
  const updateAdminMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EditAdminForm }) => {
      return await apiRequest(`/api/admin/admins/${id}`, {
        method: "PATCH",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Admin Updated",
        description: "Admin account has been updated successfully.",
      });
      setEditingAdmin(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admins"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin account.",
        variant: "destructive",
      });
    },
  });

  // Delete admin mutation
  const deleteAdminMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/admins/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Admin Deleted",
        description: "Admin account has been deleted successfully.",
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admins"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete admin account.",
        variant: "destructive",
      });
    },
  });

  // Forms
  const createForm = useForm<CreateAdminForm>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "admin",
    },
  });

  const editForm = useForm<EditAdminForm>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "admin",
      isActive: true,
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (editingAdmin) {
      editForm.reset({
        username: editingAdmin.username,
        email: editingAdmin.email,
        role: editingAdmin.role,
        isActive: editingAdmin.isActive,
      });
    }
  }, [editingAdmin, editForm]);

  // Filter admins based on search
  const filteredAdmins = adminUsers.filter((admin: AdminUser) =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Submit handlers
  const onCreateSubmit = (data: CreateAdminForm) => {
    createAdminMutation.mutate(data);
  };

  const onEditSubmit = (data: EditAdminForm) => {
    if (editingAdmin) {
      updateAdminMutation.mutate({ id: editingAdmin.id, data });
    }
  };

  // Loading state
  if (userLoading || isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading admin management...</div>
      </div>
    );
  }

  // Access denied state
  if (!currentUser || currentUser.role !== 'superadmin') {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p>Super admin privileges required to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground">
            Manage admin accounts, roles, and permissions
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
              <DialogDescription>
                Create a new admin account with specified role and permissions.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be at least 8 characters long.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Admin: Standard admin privileges. Super Admin: Full system access.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createAdminMutation.isPending}>
                    {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by username, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Users ({filteredAdmins.length})</CardTitle>
          <CardDescription>
            Manage all admin accounts and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAdmins.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No admin users found.
              </div>
            ) : (
              filteredAdmins.map((admin: AdminUser) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {admin.role === 'superadmin' ? (
                        <ShieldCheck className="w-8 h-8 text-red-500" />
                      ) : (
                        <Shield className="w-8 h-8 text-blue-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium">{admin.username}</h3>
                        <Badge variant={admin.role === 'superadmin' ? 'destructive' : 'default'}>
                          {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                        <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Last login: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Edit Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAdmin(admin)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Admin: {admin.username}</DialogTitle>
                          <DialogDescription>
                            Update admin account information and permissions.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...editForm}>
                          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <FormField
                              control={editForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={editForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Enter email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={editForm.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Role</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="superadmin">Super Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={editForm.control}
                              name="isActive"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="mt-1"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Active Account</FormLabel>
                                    <FormDescription>
                                      Unchecking will deactivate the admin account.
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingAdmin(null)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={updateAdminMutation.isPending}>
                                {updateAdminMutation.isPending ? "Updating..." : "Update Admin"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={admin.id === currentUser.id} // Prevent self-deletion
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Admin Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the admin account for "{admin.username}"? 
                            This action cannot be undone and will permanently remove their access.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteAdminMutation.mutate(admin.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteAdminMutation.isPending}
                          >
                            {deleteAdminMutation.isPending ? "Deleting..." : "Delete Admin"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      </div>
      <AdminFooterLogout />
    </div>
  );
}