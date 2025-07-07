import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCard } from "@/components/profile-card";
import { Link } from "wouter";
import { Loader2, Shield, Clock, Heart, CheckCircle, Star, Users } from "lucide-react";
import { addLanguageToPath, getCurrentLanguage } from "@/lib/i18n";
import type { Profile } from "@shared/schema";
import SEO, { structuredDataSchemas } from "@/components/SEO";

export default function Home() {
  const currentLanguage = getCurrentLanguage();
  const { data: featuredProfiles, isLoading } = useQuery<Profile[]>({
    queryKey: ['/api/profiles/featured'],
  });

  // Success testimonials data for structured data
  const testimonials = [
    { rating: 5, author: "Michael K.", text: "Found my perfect Dominican partner through HolaCupid. Amazing service!", date: "2024-12-15" },
    { rating: 5, author: "James R.", text: "Authentic profiles and genuine connections. Highly recommended!", date: "2024-12-10" },
    { rating: 5, author: "David M.", text: "Professional service with beautiful, verified Dominican women.", date: "2024-12-05" }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        page="homepage" 
        structuredData={{
          ...structuredDataSchemas.website,
          ...structuredDataSchemas.organization,
          ...structuredDataSchemas.service,
          ...structuredDataSchemas.review(testimonials)
        }}
      />
      
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
              Meet Beautiful Dominican Women for Marriage
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with authentic, verified Dominican women seeking serious relationships. Browse genuine profiles, discover cultural connections, and find your perfect match today.
            </p>
            <div className="flex justify-center">
              <Link href={addLanguageToPath('/browse', currentLanguage)}>
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Browse Profiles
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
            <Link href={addLanguageToPath('/browse', currentLanguage)}>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Profiles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
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

      {/* Dominican Culture & CupidTags Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Dominican Culture & Personality
            </h2>
            <p className="text-xl text-gray-600">
              Our unique CupidTags system helps you find Dominican women who match your lifestyle and values
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Cultural Highlights */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Dominican Women?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Family-Oriented Values</h4>
                    <p className="text-gray-600">Deep commitment to family, loyalty, and long-term relationships</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Passionate & Caring</h4>
                    <p className="text-gray-600">Known for their warmth, affection, and dedication to relationships</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Cultural Authenticity</h4>
                    <p className="text-gray-600">Rich Dominican heritage with strong traditional values and modern outlook</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CupidTags System */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">CupidTags™ Personality System</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <Star className="h-5 w-5 text-yellow-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Family-First</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <Heart className="h-5 w-5 text-red-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Romantic</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <Users className="h-5 w-5 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Social</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Loyal</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <Shield className="h-5 w-5 text-purple-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Traditional</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <Clock className="h-5 w-5 text-orange-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Marriage-Minded</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Each profile is tagged with personality traits to help you find your perfect match based on compatibility and shared values.
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

      {/* Success Stories & Testimonials */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real connections leading to meaningful relationships
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-semibold text-sm">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Call-to-Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Find Your Dominican Match?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Join thousands of satisfied customers who found love through HolaCupid
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8">
                  Browse Profiles Now
                </Button>
              </Link>
              <Link href="/submit-profile">
                <Button variant="outline" size="lg" className="px-8">
                  Join as a Model
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
