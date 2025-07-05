import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCard } from "@/components/profile-card";
import { Link } from "wouter";
import { Loader2, Shield, Clock, Heart } from "lucide-react";
import type { Profile } from "@shared/schema";

export default function Home() {
  const { data: featuredProfiles, isLoading } = useQuery<Profile[]>({
    queryKey: ['/api/profiles/featured'],
  });

  return (
    <div className="min-h-screen">
      {/* Top Call-to-Action Banner */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-3 sm:mb-0">
              <h3 className="text-lg font-semibold">Are you a beautiful Dominican woman?</h3>
              <p className="text-sm opacity-90">Join our verified community and start earning money today!</p>
            </div>
            <Link href="/submit-profile">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8">
                Submit Your Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Meet Beautiful Dominican Women
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with verified profiles from Dominican Republic. Browse, select, and get direct contact information instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Browse Profiles
                </Button>
              </Link>
              <Link href="/submit-profile">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Submit Your Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Profiles
            </h2>
            <p className="text-xl text-gray-600">
              Meet our most popular verified members
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProfiles?.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/browse">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Profiles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, secure, and instant connection process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Browse Profiles
              </h3>
              <p className="text-gray-600">
                Explore verified profiles of beautiful Dominican women. View photos, read descriptions, and see available contact methods.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Add to Cart & Purchase
              </h3>
              <p className="text-gray-600">
                Select the profiles you're interested in, add them to your cart, and complete secure checkout. Bulk discounts available.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Get Contact Info
              </h3>
              <p className="text-gray-600">
                Receive verified contact information instantly after payment. WhatsApp, Instagram, email, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HolaCupid?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Verified Profiles</h3>
                <p className="text-gray-600">
                  All profiles are manually verified and approved by our team
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
                <p className="text-gray-600">
                  Get contact information immediately after payment
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Authentic Connections</h3>
                <p className="text-gray-600">
                  Real contact information from genuine Dominican women
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
