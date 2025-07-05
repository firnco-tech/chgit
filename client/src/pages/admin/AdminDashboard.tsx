/**
 * ADMIN PANEL PAGE - Isolated from main site
 * 
 * AdminDashboard.tsx - Main dashboard for admin panel
 * Provides overview of platform statistics and recent activity
 */

import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FileText,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  const { data: recentProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["/api/admin/recent-profiles"],
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/admin/recent-orders"],
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      description: "Registered users",
      trend: "+12% from last month",
      color: "text-blue-600"
    },
    {
      title: "Active Profiles",
      value: stats?.activeProfiles || 0,
      icon: FileText,
      description: "Approved profiles",
      trend: `${stats?.pendingProfiles || 0} pending approval`,
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      description: "All time orders",
      trend: `${stats?.completedOrders || 0} completed`,
      color: "text-purple-600"
    },
    {
      title: "Revenue",
      value: `$${stats?.totalRevenue || 0}`,
      icon: DollarSign,
      description: "Total revenue",
      trend: "+8% from last month",
      color: "text-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management tools</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Profiles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Profile Submissions</span>
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
              <CardDescription>Latest profiles awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              {profilesLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentProfiles?.map((profile: any) => (
                    <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{profile.firstName} {profile.lastName}</p>
                          <p className="text-sm text-gray-500">{profile.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={profile.isApproved ? "default" : "secondary"}>
                          {profile.isApproved ? "Approved" : "Pending"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Orders</span>
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
              <CardDescription>Latest customer purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders?.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">${order.total}</span>
                        <Badge variant={order.status === 'completed' ? "default" : "secondary"}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <CheckCircle className="h-6 w-6" />
                <span>Approve Profiles</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <AlertCircle className="h-6 w-6" />
                <span>System Alerts</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}