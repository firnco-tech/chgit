import { Link } from "wouter";
import { Shield, Eye, MapPin, MessageCircle, AlertTriangle, Phone, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Safety() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Essential Safety Guidelines */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Essential Safety Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Verify Before You Meet */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Eye className="h-6 w-6 text-blue-600 mr-3" />
                  <CardTitle className="text-xl text-gray-900">Verify Before You Meet</CardTitle>
                </div>
                <CardDescription>
                  Always verify the person's identity through video calls or additional photos before meeting in person.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  Request a video call before meeting
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  Ask for additional recent photos
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  Verify their social media profiles
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  Trust your instincts if something feels off
                </div>
              </CardContent>
            </Card>

            {/* Meet in Public Places */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <MapPin className="h-6 w-6 text-green-600 mr-3" />
                  <CardTitle className="text-xl text-gray-900">Meet in Public Places</CardTitle>
                </div>
                <CardDescription>
                  Always choose public, well-lit locations for your first meetings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">•</span>
                  Meet in busy restaurants or cafes
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">•</span>
                  Avoid private or isolated locations
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">•</span>
                  Let someone know where you're going
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">•</span>
                  Have your own transportation
                </div>
              </CardContent>
            </Card>

            {/* Protect Your Personal Information */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Shield className="h-6 w-6 text-purple-600 mr-3" />
                  <CardTitle className="text-xl text-gray-900">Protect Your Personal Information</CardTitle>
                </div>
                <CardDescription>
                  Be cautious about sharing sensitive personal details too quickly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-600 mr-2">•</span>
                  Don't share your home address immediately
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-600 mr-2">•</span>
                  Be careful with financial information
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-600 mr-2">•</span>
                  Use the platform's messaging initially
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-600 mr-2">•</span>
                  Gradually build trust over time
                </div>
              </CardContent>
            </Card>

            {/* Communication Safety */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <MessageCircle className="h-6 w-6 text-orange-600 mr-3" />
                  <CardTitle className="text-xl text-gray-900">Communication Safety</CardTitle>
                </div>
                <CardDescription>
                  Use safe communication practices when connecting with new people.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-600 mr-2">•</span>
                  Start with platform messaging
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-600 mr-2">•</span>
                  Use a separate phone number initially
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-600 mr-2">•</span>
                  Be wary of requests for money
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-orange-600 mr-2">•</span>
                  Report suspicious behavior immediately
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Warning Signs */}
        <div className="mb-12">
          <Card className="bg-white shadow-lg border-red-200">
            <CardHeader>
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <CardTitle className="text-2xl text-gray-900">Warning Signs to Watch For</CardTitle>
              </div>
              <CardDescription>
                Be alert to these potential red flags that may indicate fraudulent or unsafe behavior:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Asks for money or financial assistance
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Refuses to video chat or talk on the phone
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Has very few photos or photos that look professional
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Stories don't add up or change over time
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Pushes to meet immediately or move off the platform
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Uses overly romantic language very quickly
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Claims to be traveling or unable to meet for extended periods
                  </AlertDescription>
                </Alert>
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Asks for personal information like SSN or bank details
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Online Connection Best Practices */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Online Connection Best Practices</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Before Meeting */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Eye className="h-6 w-6 text-blue-600 mr-3" />
                  <CardTitle className="text-xl text-gray-900">Before Meeting</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  Exchange multiple photos
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  Have video conversations
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  Verify their identity
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  Research their background
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  Trust your instincts
                </div>
              </CardContent>
            </Card>

            {/* During the Meeting */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Users className="h-6 w-6 text-green-600 mr-3" />
                  <CardTitle className="text-xl text-gray-900">During the Meeting</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">•</span>
                  Meet in public places
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">•</span>
                  Tell someone your plans
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">•</span>
                  Have your own transportation
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">•</span>
                  Keep your phone charged
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">•</span>
                  Stay alert and sober
                </div>
              </CardContent>
            </Card>

            {/* After Meeting */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Heart className="h-6 w-6 text-purple-600 mr-3" />
                  <CardTitle className="text-xl text-gray-900">After Meeting</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-600 mr-2">•</span>
                  Check in with friends
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-600 mr-2">•</span>
                  Take time to reflect
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-600 mr-2">•</span>
                  Continue building trust slowly
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-600 mr-2">•</span>
                  Report any concerns
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-600 mr-2">•</span>
                  Follow your comfort level
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Resources */}
        <div className="mb-12">
          <Card className="bg-white shadow-lg border-orange-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Emergency Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Phone className="h-5 w-5 text-red-600 mr-2" />
                    Emergency Numbers
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <span className="text-red-600 mr-2">•</span>
                      Emergency Services: 911
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-red-600 mr-2">•</span>
                      National Domestic Violence Hotline: 1-800-799-7233
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-red-600 mr-2">•</span>
                      Crisis Text Line: Text HOME to 741741
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    Safety Apps
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <span className="text-blue-600 mr-2">•</span>
                      Share your location with trusted contacts
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-blue-600 mr-2">•</span>
                      Use safety check-in apps
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-blue-600 mr-2">•</span>
                      Keep emergency contacts easily accessible
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Need to Report Something */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need to Report Something?</h3>
          <p className="text-gray-700 mb-6">
            If you encounter suspicious behavior or feel unsafe, please report it immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-md">
              Report an Issue
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50 font-medium py-3 px-8 rounded-md">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}