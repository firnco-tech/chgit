import { Link } from "wouter";
import { MessageCircle, Shield, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/contact">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-pink-600 group-hover:text-pink-700" />
                <CardTitle className="text-xl group-hover:text-pink-700">Contact Support</CardTitle>
                <CardDescription>Get personalized help from our team</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto text-green-600 group-hover:text-green-700" />
              <CardTitle className="text-xl group-hover:text-green-700">Safety Tips</CardTitle>
              <CardDescription>Learn how to stay safe online</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-orange-600 group-hover:text-orange-700" />
              <CardTitle className="text-xl group-hover:text-orange-700">Report Issue</CardTitle>
              <CardDescription>Report problems or concerns</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Browse by Category */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Getting Started</CardTitle>
                <CardDescription>Learn how to browse profiles and make connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">How to browse profiles</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Understanding our verification process</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Creating your first purchase</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Setting up your account</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Payments & Billing */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Payments & Billing</CardTitle>
                <CardDescription>Information about pricing, payments, and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Pricing structure explained</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Payment methods accepted</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Refund policy</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Billing questions</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Safety & Security */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Safety & Security</CardTitle>
                <CardDescription>Stay safe while making connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Safety guidelines</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Reporting inappropriate behavior</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Privacy protection</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Verification badges</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Profile Management */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Profile Management</CardTitle>
                <CardDescription>Submit and manage your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">How to submit your profile</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Profile approval process</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Updating your information</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-gray-700">Photo guidelines</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">How does HolaCupid work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  HolaCupid is a platform where you can browse verified profiles and purchase contact information to make direct connections. Simply browse profiles, add your favorites to cart, and complete your purchase to receive contact details.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Are all profiles verified?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes, all profiles go through our manual verification process to ensure authenticity. We verify photos, contact information, and profile details before approval.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">What contact information do I receive?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  After purchase, you'll receive verified contact information which may include phone numbers, email addresses, and social media profiles, depending on what each person has provided.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">How much does it cost?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Individual contacts cost $2 each for 1-9 contacts. If you purchase 10 or more contacts, the price drops to $1 each. There are no monthly fees or subscriptions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Is my payment secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes, we use industry-standard SSL encryption and work with trusted payment processors to ensure your financial information is completely secure.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">How do I submit my profile?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Click the 'Submit Profile' button in the header, fill out the comprehensive form with your photos and information, and our team will review it within 24-48 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-700 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link href="/contact">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-8 rounded-md">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}