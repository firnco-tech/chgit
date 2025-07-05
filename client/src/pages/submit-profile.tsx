import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { insertProfileSchema } from "@shared/schema";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle, Shield, Clock } from "lucide-react";

const submitProfileSchema = insertProfileSchema.extend({
  contactMethods: z.object({
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
    email: z.string().optional(),
    telegram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
  }).refine((data) => {
    return Object.values(data).some(value => value && value.trim().length > 0);
  }, {
    message: "At least one contact method must be provided",
  }),
});

type SubmitProfileFormData = z.infer<typeof submitProfileSchema>;

export default function SubmitProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [contactMethodsEnabled, setContactMethodsEnabled] = useState({
    whatsapp: false,
    instagram: false,
    tiktok: false,
    facebook: false,
    telegram: false,
    email: false,
  });
  
  const form = useForm<SubmitProfileFormData>({
    resolver: zodResolver(submitProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 18,
      gender: "",
      height: "",
      location: "",
      education: "",
      occupation: "",
      occupationDetails: "",
      languages: [],
      relationshipStatus: "",
      children: "",
      smoking: "",
      drinking: "",
      bodyType: "",
      appearance: "",
      lookingFor: [],
      aboutMe: "",
      interests: [],
      photos: [],
      videos: [],
      contactMethods: {
        whatsapp: "",
        instagram: "",
        email: "",
        telegram: "",
        facebook: "",
        tiktok: "",
      },
      ageConfirmation: false,
      termsAccepted: false,
      reviewConsent: false,
      contactSharingConsent: false,
    },
  });

  const submitProfileMutation = useMutation({
    mutationFn: async (data: SubmitProfileFormData) => {
      return apiRequest("POST", "/api/profiles", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile submitted successfully!",
        description: "Your profile has been submitted for review. We'll get back to you within 24-48 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting profile",
        description: error.message || "There was an error submitting your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SubmitProfileFormData) => {
    setIsSubmitting(true);
    submitProfileMutation.mutate(data);
    setIsSubmitting(false);
  };

  const toggleLanguage = (language: string) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(newLanguages);
    form.setValue("languages", newLanguages);
  };

  const toggleLookingFor = (option: string) => {
    const newLookingFor = selectedLookingFor.includes(option)
      ? selectedLookingFor.filter(l => l !== option)
      : [...selectedLookingFor, option];
    setSelectedLookingFor(newLookingFor);
    form.setValue("lookingFor", newLookingFor);
  };

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(newInterests);
    form.setValue("interests", newInterests);
  };

  const toggleContactMethod = (method: keyof typeof contactMethodsEnabled) => {
    setContactMethodsEnabled(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Why Join HolaCupid?</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verified Community</h3>
                <p className="text-sm text-gray-600">Join our exclusive verified member base</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Safe & Secure</h3>
                <p className="text-sm text-gray-600">Your privacy and safety are our priority</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quick Approval</h3>
                <p className="text-sm text-gray-600">Get approved within 24-48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Personal Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
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
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            placeholder="18"
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
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select height" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="4'10&quot;">4'10"</SelectItem>
                            <SelectItem value="4'11&quot;">4'11"</SelectItem>
                            <SelectItem value="5'0&quot;">5'0"</SelectItem>
                            <SelectItem value="5'1&quot;">5'1"</SelectItem>
                            <SelectItem value="5'2&quot;">5'2"</SelectItem>
                            <SelectItem value="5'3&quot;">5'3"</SelectItem>
                            <SelectItem value="5'4&quot;">5'4"</SelectItem>
                            <SelectItem value="5'5&quot;">5'5"</SelectItem>
                            <SelectItem value="5'6&quot;">5'6"</SelectItem>
                            <SelectItem value="5'7&quot;">5'7"</SelectItem>
                            <SelectItem value="5'8&quot;">5'8"</SelectItem>
                            <SelectItem value="5'9&quot;">5'9"</SelectItem>
                            <SelectItem value="5'10&quot;">5'10"</SelectItem>
                            <SelectItem value="5'11&quot;">5'11"</SelectItem>
                            <SelectItem value="6'0&quot;">6'0"</SelectItem>
                            <SelectItem value="6'1&quot;">6'1"</SelectItem>
                            <SelectItem value="6'2&quot;">6'2"</SelectItem>
                            <SelectItem value="6'3&quot;">6'3"</SelectItem>
                            <SelectItem value="6'4&quot;">6'4"</SelectItem>
                            <SelectItem value="6'5&quot;">6'5"</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
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
                            <SelectItem value="Barahona">Barahona</SelectItem>
                            <SelectItem value="Moca">Moca</SelectItem>
                            <SelectItem value="San Francisco de Macorís">San Francisco de Macorís</SelectItem>
                            <SelectItem value="Higüey">Higüey</SelectItem>
                            <SelectItem value="Azua">Azua</SelectItem>
                            <SelectItem value="Bonao">Bonao</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High School">High School</SelectItem>
                            <SelectItem value="Some College">Some College</SelectItem>
                            <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                            <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                            <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                            <SelectItem value="PhD">PhD</SelectItem>
                            <SelectItem value="Trade School">Trade School</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedOccupation(value);
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select occupation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Own my business">Own my business</SelectItem>
                            <SelectItem value="Employed">Employed</SelectItem>
                            <SelectItem value="Part Time">Part Time</SelectItem>
                            <SelectItem value="Full Time">Full Time</SelectItem>
                            <SelectItem value="Domestic / Stay at Home">Domestic / Stay at Home</SelectItem>
                            <SelectItem value="Unemployed">Unemployed</SelectItem>
                            <SelectItem value="Looking for work">Looking for work</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {selectedOccupation && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected occupation: {selectedOccupation}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <FormLabel className="text-base font-medium">Languages Spoken</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {['Spanish', 'English', 'French', 'Portuguese', 'Italian', 'German', 'Chinese', 'Japanese'].map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`language-${language}`}
                          checked={selectedLanguages.includes(language)}
                          onCheckedChange={() => toggleLanguage(language)}
                        />
                        <label 
                          htmlFor={`language-${language}`} 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedLanguages.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">Selected: {selectedLanguages.join(', ')}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="relationshipStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                            <SelectItem value="Separated">Separated</SelectItem>
                            <SelectItem value="It's complicated">It's complicated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="children"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Children</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="No children">No children</SelectItem>
                            <SelectItem value="Have children">Have children</SelectItem>
                            <SelectItem value="Want children">Want children</SelectItem>
                            <SelectItem value="Don't want children">Don't want children</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="smoking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Smoking</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Non-smoker">Non-smoker</SelectItem>
                            <SelectItem value="Occasional">Occasional</SelectItem>
                            <SelectItem value="Regular">Regular</SelectItem>
                            <SelectItem value="Heavy">Heavy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bodyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Slim">Slim</SelectItem>
                            <SelectItem value="Athletic">Athletic</SelectItem>
                            <SelectItem value="Average">Average</SelectItem>
                            <SelectItem value="Curvy">Curvy</SelectItem>
                            <SelectItem value="Full figured">Full figured</SelectItem>
                            <SelectItem value="Muscular">Muscular</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appearance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appearance</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Very attractive">Very attractive</SelectItem>
                            <SelectItem value="Attractive">Attractive</SelectItem>
                            <SelectItem value="Average">Average</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="drinking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drinking</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Never">Never</SelectItem>
                            <SelectItem value="Rarely">Rarely</SelectItem>
                            <SelectItem value="Socially">Socially</SelectItem>
                            <SelectItem value="Regularly">Regularly</SelectItem>
                            <SelectItem value="Frequently">Frequently</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormLabel className="text-base font-medium">Looking For</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {[
                      'Long term partner',
                      'Short term fun',
                      'Long term, open to short',
                      'Short term, open to long',
                      'New friends',
                      'Still figuring it out'
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`looking-${option}`}
                          checked={selectedLookingFor.includes(option)}
                          onCheckedChange={() => toggleLookingFor(option)}
                        />
                        <label 
                          htmlFor={`looking-${option}`} 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedLookingFor.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">Selected options: {selectedLookingFor.join(', ')}</p>
                  )}
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="aboutMe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About You</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormLabel className="text-base font-medium">Interests & Hobbies</FormLabel>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                    {[
                      'Travel', 'Music', 'Dancing', 'Art', 'Cooking', 'Reading',
                      'Fitness', 'Beach', 'Photography', 'Movies', 'Nature', 'Yoga',
                      'Fashion', 'Business', 'Sports', 'Gaming', 'Technology', 'Hiking',
                      'Swimming', 'Salsa', 'Culture', 'Languages', 'Shopping', 'Spa'
                    ].map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`interest-${interest}`}
                          checked={selectedInterests.includes(interest)}
                          onCheckedChange={() => toggleInterest(interest)}
                        />
                        <label 
                          htmlFor={`interest-${interest}`} 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedInterests.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">Selected interests: {selectedInterests.join(', ')}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Photos & Videos */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos & Videos *</h2>
                <p className="text-sm text-gray-600 mb-4">Upload Photos and Videos (3-10 files required)</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Button type="button" variant="outline" className="mb-4">
                    Upload Photos & Videos
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    <h4 className="font-medium mb-2">Photo & Video Guidelines:</h4>
                    <ul className="text-left space-y-1">
                      <li>• Upload 3-10 high-quality photos and videos</li>
                      <li>• Include at least one clear face photo</li>
                      <li>• Photos and videos should be recent (within 1 year)</li>
                      <li>• No inappropriate or explicit content</li>
                      <li>• You must be the only person in the photos/videos</li>
                      <li>• Videos should be under 30 seconds</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Methods */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Methods</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Select which contact methods you want to provide. These will be shared with clients after purchase.
                  <span className="font-semibold"> At least one contact method must be selected and completed.</span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WhatsApp */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id="whatsapp"
                        checked={contactMethodsEnabled.whatsapp}
                        onCheckedChange={() => toggleContactMethod('whatsapp')}
                      />
                      <label htmlFor="whatsapp" className="text-sm font-medium flex items-center space-x-2">
                        <span className="text-green-600">📱</span>
                        <span>WhatsApp</span>
                      </label>
                    </div>
                    <FormField
                      control={form.control}
                      name="contactMethods.whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Share your WhatsApp contact"
                              disabled={!contactMethodsEnabled.whatsapp}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Instagram */}
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id="instagram"
                        checked={contactMethodsEnabled.instagram}
                        onCheckedChange={() => toggleContactMethod('instagram')}
                      />
                      <label htmlFor="instagram" className="text-sm font-medium flex items-center space-x-2">
                        <span className="text-pink-600">📷</span>
                        <span>Instagram</span>
                      </label>
                    </div>
                    <FormField
                      control={form.control}
                      name="contactMethods.instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Share your Instagram handle"
                              disabled={!contactMethodsEnabled.instagram}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* TikTok */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id="tiktok"
                        checked={contactMethodsEnabled.tiktok}
                        onCheckedChange={() => toggleContactMethod('tiktok')}
                      />
                      <label htmlFor="tiktok" className="text-sm font-medium flex items-center space-x-2">
                        <span className="text-blue-600">🎵</span>
                        <span>TikTok</span>
                      </label>
                    </div>
                    <FormField
                      control={form.control}
                      name="contactMethods.tiktok"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Share your TikTok handle"
                              disabled={!contactMethodsEnabled.tiktok}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Facebook */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id="facebook"
                        checked={contactMethodsEnabled.facebook}
                        onCheckedChange={() => toggleContactMethod('facebook')}
                      />
                      <label htmlFor="facebook" className="text-sm font-medium flex items-center space-x-2">
                        <span className="text-blue-600">📘</span>
                        <span>Facebook</span>
                      </label>
                    </div>
                    <FormField
                      control={form.control}
                      name="contactMethods.facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Share your Facebook profile"
                              disabled={!contactMethodsEnabled.facebook}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Telegram */}
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id="telegram"
                        checked={contactMethodsEnabled.telegram}
                        onCheckedChange={() => toggleContactMethod('telegram')}
                      />
                      <label htmlFor="telegram" className="text-sm font-medium flex items-center space-x-2">
                        <span className="text-sky-600">✈️</span>
                        <span>Telegram</span>
                      </label>
                    </div>
                    <FormField
                      control={form.control}
                      name="contactMethods.telegram"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Share your Telegram username"
                              disabled={!contactMethodsEnabled.telegram}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Email */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id="email"
                        checked={contactMethodsEnabled.email}
                        onCheckedChange={() => toggleContactMethod('email')}
                      />
                      <label htmlFor="email" className="text-sm font-medium flex items-center space-x-2">
                        <span className="text-yellow-600">📧</span>
                        <span>Email</span>
                      </label>
                    </div>
                    <FormField
                      control={form.control}
                      name="contactMethods.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Share your email address"
                              disabled={!contactMethodsEnabled.email}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Agreements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms and Agreements</h2>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ageConfirmation"
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
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="termsAccepted"
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
                            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reviewConsent"
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
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Important Notice:</h4>
                  <p className="text-sm text-orange-800">
                    By submitting your profile, you consent to having your contact information (phone, email, social media) made available for purchase by other users of the platform. This is how our service works - users can browse profiles and purchase contact information to make connections.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || submitProfileMutation.isPending}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200"
                  size="lg"
                >
                  {isSubmitting || submitProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Profile for Review"
                  )}
                </Button>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                  Your profile will be reviewed within 24-48 hours
                </p>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}