import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Shield, Clock, CheckCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProfileSchema } from "@shared/schema";
import { z } from "zod";

const submitProfileSchema = insertProfileSchema.extend({
  contactMethods: z.object({
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
    email: z.string().email().optional(),
    telegram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
  photos: z.array(z.string()).min(1, "At least one photo is required"),
  interests: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  lookingFor: z.array(z.string()).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  confirmAge: z.boolean().refine(val => val === true, "You must confirm you are 18 or older"),
  understandReview: z.boolean().refine(val => val === true, "You must understand the review process"),
});

type SubmitProfileFormData = z.infer<typeof submitProfileSchema>;

export default function SubmitProfile() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<SubmitProfileFormData>({
    resolver: zodResolver(submitProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 18,
      gender: "female",
      location: "",
      aboutMe: "",
      contactMethods: {},
      photos: [],
      interests: [],
      languages: [],
      lookingFor: [],
      agreeToTerms: false,
      confirmAge: false,
      understandReview: false,
    },
  });

  const submitProfileMutation = useMutation({
    mutationFn: async (data: SubmitProfileFormData) => {
      const { agreeToTerms, confirmAge, understandReview, ...profileData } = data;
      return apiRequest("POST", "/api/profiles", profileData);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Profile submitted successfully!",
        description: "Your profile will be reviewed within 24-48 hours."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting profile",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    },
  });

  const onSubmit = (data: SubmitProfileFormData) => {
    submitProfileMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profile Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your profile. Our team will review it within 24-48 hours and notify you once it's approved.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Submit Your Profile
          </h1>
          <p className="text-xl text-gray-600">
            Join our verified community of beautiful Dominican women
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Community</h3>
              <p className="text-gray-600">Join our exclusive verified member base</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">Your privacy and safety are our priority</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Approval</h3>
              <p className="text-gray-600">Get approved within 24-48 hours</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="18" 
                              max="99"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Santo Domingo">Santo Domingo</SelectItem>
                              <SelectItem value="Santiago">Santiago</SelectItem>
                              <SelectItem value="Puerto Plata">Puerto Plata</SelectItem>
                              <SelectItem value="La Romana">La Romana</SelectItem>
                              <SelectItem value="Punta Cana">Punta Cana</SelectItem>
                              <SelectItem value="San Pedro de Macorís">San Pedro de Macorís</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* About You */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About You</h3>
                  <FormField
                    control={form.control}
                    name="aboutMe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us about yourself</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4} 
                            placeholder="Tell us about yourself..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Methods */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Methods</h3>
                  <p className="text-gray-600 mb-4">
                    Select which contact methods you want to provide. These will be shared with clients after purchase. 
                    <strong> At least one contact method must be provided.</strong>
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Checkbox id="whatsapp" />
                      <label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
                        WhatsApp
                      </label>
                      <Input 
                        placeholder="WhatsApp number" 
                        className="flex-1"
                        onChange={(e) => {
                          form.setValue('contactMethods.whatsapp', e.target.value);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Checkbox id="instagram" />
                      <label htmlFor="instagram" className="text-sm font-medium text-gray-700">
                        Instagram
                      </label>
                      <Input 
                        placeholder="Instagram username" 
                        className="flex-1"
                        onChange={(e) => {
                          form.setValue('contactMethods.instagram', e.target.value);
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Checkbox id="email" />
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Input 
                        type="email"
                        placeholder="Email address" 
                        className="flex-1"
                        onChange={(e) => {
                          form.setValue('contactMethods.email', e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Photos *</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload Photos (3-10 files required)</p>
                    <Button type="button" variant="outline">
                      Upload Photos
                    </Button>
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>Photo Guidelines:</strong></p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Upload 3-10 high-quality photos</li>
                        <li>Include at least one clear face photo</li>
                        <li>Photos should be recent (within 1 year)</li>
                        <li>No inappropriate or explicit content</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Terms and Agreements */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Terms and Agreements</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="confirmAge"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I confirm that I am 18 years of age or older *
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the Terms of Service and Privacy Policy *
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="understandReview"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I understand that my profile will be manually reviewed and verified before going live *
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Important Notice:</strong> By submitting your profile, you consent to having your contact information 
                      (phone, email, social media) made available for purchase by other users of the platform. This is how our 
                      service works - users can browse profiles and purchase contact information to make connections.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={submitProfileMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {submitProfileMutation.isPending ? "Submitting..." : "Submit Profile for Review"}
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Your profile will be reviewed within 24-48 hours
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
