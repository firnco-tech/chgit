import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Users, Award, MapPin, Clock } from "lucide-react";
import SEO, { structuredDataSchemas } from "@/components/SEO";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <SEO 
        page="about" 
        structuredData={structuredDataSchemas.website}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About HolaCupid
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            The premier Dominican dating platform connecting singles worldwide with authentic Dominican women 
            seeking meaningful relationships. Founded on trust, cultural respect, and genuine connections.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                HolaCupid bridges cultures and creates lasting relationships between Dominican women and 
                international partners. We believe in authentic connections, cultural appreciation, and 
                the power of love to transcend borders.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-pink-600 border-pink-200">
                  <Heart className="h-3 w-3 mr-1" />
                  Authentic Connections
                </Badge>
                <Badge variant="outline" className="text-pink-600 border-pink-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Safety First
                </Badge>
                <Badge variant="outline" className="text-pink-600 border-pink-200">
                  <Users className="h-3 w-3 mr-1" />
                  Cultural Respect
                </Badge>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Verified Profiles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600">Success Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">25+</div>
                  <div className="text-sm text-gray-600">Countries Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">5★</div>
                  <div className="text-sm text-gray-600">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose HolaCupid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose HolaCupid?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Profiles</h3>
                <p className="text-gray-600">
                  Every profile goes through our rigorous verification process to ensure authenticity 
                  and safety for all members.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cultural Bridge</h3>
                <p className="text-gray-600">
                  We celebrate Dominican culture and facilitate meaningful connections between 
                  different cultures and backgrounds.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Success Focused</h3>
                <p className="text-gray-600">
                  Our platform is designed to create lasting relationships, not just casual encounters. 
                  Success stories are our motivation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Dominican Culture Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Celebrating Dominican Culture
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  <MapPin className="inline h-5 w-5 mr-2 text-pink-600" />
                  About the Dominican Republic
                </h3>
                <p className="text-gray-700 mb-4">
                  The Dominican Republic is a Caribbean nation known for its warm culture, beautiful beaches, 
                  and vibrant music. Dominican women are celebrated for their warmth, family values, and 
                  genuine approach to relationships.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    <span className="text-gray-700">Rich cultural heritage</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    <span className="text-gray-700">Strong family values</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    <span className="text-gray-700">Warm and welcoming nature</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  <Heart className="inline h-5 w-5 mr-2 text-pink-600" />
                  What Makes Dominican Women Special
                </h3>
                <p className="text-gray-700 mb-4">
                  Dominican women are known for their passion, loyalty, and dedication to family. They 
                  bring warmth, love, and cultural richness to relationships.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    <span className="text-gray-700">Passionate and loving</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    <span className="text-gray-700">Family-oriented</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                    <span className="text-gray-700">Culturally rich</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety & Security */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8">Safety & Security</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  <Shield className="inline h-5 w-5 mr-2" />
                  Your Safety is Our Priority
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Manual profile verification process</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Privacy protection measures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  <Clock className="inline h-5 w-5 mr-2" />
                  Our Process
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                      1
                    </div>
                    <div>
                      <div className="font-semibold">Profile Submission</div>
                      <div className="text-sm opacity-90">Women submit their profiles with photos and information</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                      2
                    </div>
                    <div>
                      <div className="font-semibold">Verification</div>
                      <div className="text-sm opacity-90">Our team verifies identity and authenticity</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                      3
                    </div>
                    <div>
                      <div className="font-semibold">Approval</div>
                      <div className="text-sm opacity-90">Approved profiles go live on our platform</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Find Your Dominican Match?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of successful couples who found love through HolaCupid. 
              Start your journey to finding your perfect Dominican partner today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/browse"
                className="inline-flex items-center px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
              >
                Browse Profiles
              </a>
              <a
                href="/submit-profile"
                className="inline-flex items-center px-8 py-3 border border-pink-600 text-pink-600 font-semibold rounded-lg hover:bg-pink-50 transition-colors"
              >
                Submit Your Profile
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}