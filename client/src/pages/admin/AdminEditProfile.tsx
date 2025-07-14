/**
 * ADMIN PANEL COMPONENT - Isolated from main site
 * 
 * AdminEditProfile.tsx - Profile editing page for admin panel
 * This component allows admins to edit and update profile information
 * Completely separate from user-facing site functionality
 */

import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminFooterLogout } from "@/components/admin/AdminFooterLogout";
import { ArrowLeft, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getMediaUrl } from "@/lib/mediaUtils";

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  location: string;
  height: string;
  bodyType: string;
  skinColor?: string;
  hairColor?: string;
  eyeColor?: string;
  education?: string;
  occupation?: string;
  occupationDetails?: string;
  relationshipStatus?: string;
  children?: string[];
  smoking?: string;
  drinking?: string;
  aboutMe?: string;
  interests?: string[];
  languages?: string[];
  lookingFor?: string[];
  photos?: string[];
  videos?: string[];
  primaryPhoto?: string;
  appearance?: string;
  contactMethods?: any;
  contactWhatsapp?: string;
  contactInstagram?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactTelegram?: string;
  contactFacebook?: string;
  contactTiktok?: string;
  price?: number;
  status?: string;
  isApproved?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  inactivePhotos?: string[];
  inactiveVideos?: string[];
}

export default function AdminEditProfile() {
  const params = useParams();
  const profileId = parseInt(params.id as string);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Fetch profile data
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: [`/api/admin/profiles/${profileId}`],
    enabled: !!profileId,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      // DEBUG: Log the profile data to identify media loading issue
      console.log('🔍 ADMIN PANEL DEBUG - Profile data loaded:', profile);
      console.log('🔍 ADMIN PANEL DEBUG - Photos array:', profile.photos);
      console.log('🔍 ADMIN PANEL DEBUG - Videos array:', profile.videos);
      console.log('🔍 ADMIN PANEL DEBUG - Contact methods:', profile.contactMethods);
      
      // Extract contact methods from JSON object to individual fields
      const contactMethods = profile.contactMethods || {};
      const processedProfile = {
        ...profile,
        contactWhatsapp: contactMethods.whatsapp || '',
        contactInstagram: contactMethods.instagram || '',
        contactEmail: contactMethods.email || '',
        contactPhone: contactMethods.phone || '',
        contactTelegram: contactMethods.telegram || '',
        contactFacebook: contactMethods.facebook || '',
        contactTiktok: contactMethods.tiktok || '',
      };
      
      setFormData(processedProfile);
    }
  }, [profile]);

  // DEBUG: Watch formData changes
  useEffect(() => {
    console.log('🔍 ADMIN PANEL DEBUG - FormData changed:', {
      photos: formData.photos,
      videos: formData.videos,
      photosLength: formData.photos?.length,
      videosLength: formData.videos?.length,
      photosType: typeof formData.photos,
      videosType: typeof formData.videos
    });
  }, [formData.photos, formData.videos]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      return await apiRequest(`/api/admin/profiles/${profileId}`, { method: "PATCH", body: data });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/recent-profiles"] });
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${profileId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactMethodChange = (method: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: {
        ...((prev.contactMethods as any) || {}),
        [method]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up the form data before submitting - EXCLUDE timestamp fields
    const { createdAt, updatedAt, contactWhatsapp, contactInstagram, contactEmail, contactPhone, contactTelegram, contactFacebook, contactTiktok, ...updateableData } = formData;
    
    // Prepare contact methods object from individual fields
    const contactMethods = {
      whatsapp: formData.contactWhatsapp || '',
      instagram: formData.contactInstagram || '',
      email: formData.contactEmail || '',
      phone: formData.contactPhone || '',
      telegram: formData.contactTelegram || '',
      facebook: formData.contactFacebook || '',
      tiktok: formData.contactTiktok || '',
    };
    
    // Filter out empty contact methods
    const filteredContactMethods = Object.fromEntries(
      Object.entries(contactMethods).filter(([_, value]) => value && value.trim() !== '')
    );
    
    const cleanedData = {
      ...updateableData,
      // Contact methods as JSON object
      contactMethods: filteredContactMethods,
      // Ensure arrays are properly formatted
      photos: Array.isArray(formData.photos) ? formData.photos : [],
      videos: Array.isArray(formData.videos) ? formData.videos : [],
      interests: Array.isArray(formData.interests) ? formData.interests : [],
      languages: Array.isArray(formData.languages) ? formData.languages : [],
      lookingFor: Array.isArray(formData.lookingFor) ? formData.lookingFor : [],
      children: Array.isArray(formData.children) ? formData.children : [],
      inactivePhotos: Array.isArray(formData.inactivePhotos) ? formData.inactivePhotos : [],
      inactiveVideos: Array.isArray(formData.inactiveVideos) ? formData.inactiveVideos : [],
      // Convert string values to numbers where needed
      age: typeof formData.age === 'string' ? parseInt(formData.age) : formData.age,
      price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
      // Convert string values to boolean where needed (removed old hasChildren/wantsChildren references)
      isApproved: typeof formData.isApproved === 'string' ? formData.isApproved === 'true' : formData.isApproved,
      isFeatured: typeof formData.isFeatured === 'string' ? formData.isFeatured === 'true' : formData.isFeatured,
    };
    
    console.log('🔍 CONTACT METHODS DEBUG - Individual fields:', {
      contactWhatsapp: formData.contactWhatsapp,
      contactInstagram: formData.contactInstagram,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      contactTelegram: formData.contactTelegram,
      contactFacebook: formData.contactFacebook,
      contactTiktok: formData.contactTiktok,
    });
    console.log('🔍 CONTACT METHODS DEBUG - Filtered object:', filteredContactMethods);
    console.log('Submitting cleaned form data (timestamps excluded):', cleanedData);
    updateMutation.mutate(cleanedData);
  };

  const handleBack = () => {
    window.location.href = "/admin";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <p className="text-center text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <p className="text-center text-red-500">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Profile: {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Submitted: {new Date(profile.createdAt).toLocaleDateString()} 
                {profile.updatedAt && profile.updatedAt !== profile.createdAt && (
                  <span className="ml-3">
                    Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              profile.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              profile.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {profile.status || (profile.isApproved ? 'ACTIVE' : 'PENDING')}
            </span>
            {profile.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                FEATURED
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender || ''}
                    onValueChange={(value) => handleInputChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Select
                    value={formData.height || ''}
                    onValueChange={(value) => handleInputChange('height', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select height" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4'8&quot;">4'8"</SelectItem>
                      <SelectItem value="4'9&quot;">4'9"</SelectItem>
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
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional & Educational Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="education">Education Level</Label>
                  <Select
                    value={formData.education || ''}
                    onValueChange={(value) => handleInputChange('education', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Some College">Some College</SelectItem>
                      <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                      <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                      <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                      <SelectItem value="Doctorate">Doctorate</SelectItem>
                      <SelectItem value="Trade School">Trade School</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation || ''}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="occupationDetails">Occupation Details</Label>
                  <Input
                    id="occupationDetails"
                    value={formData.occupationDetails || ''}
                    onChange={(e) => handleInputChange('occupationDetails', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="relationshipStatus">Relationship Status</Label>
                  <Select
                    value={formData.relationshipStatus || ''}
                    onValueChange={(value) => handleInputChange('relationshipStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Physical Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bodyType">Body Type</Label>
                  <Select
                    value={formData.bodyType || ''}
                    onValueChange={(value) => handleInputChange('bodyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Slim">Slim</SelectItem>
                      <SelectItem value="Athletic">Athletic</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Curvy">Curvy</SelectItem>
                      <SelectItem value="Plus Size">Plus Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="appearance">Overall Appearance</Label>
                  <Input
                    id="appearance"
                    value={formData.appearance || ''}
                    onChange={(e) => handleInputChange('appearance', e.target.value)}
                    placeholder="Brief description of your appearance"
                  />
                </div>
                <div>
                  <Label htmlFor="skinColor">Skin Color</Label>
                  <Input
                    id="skinColor"
                    value={formData.skinColor || ''}
                    onChange={(e) => handleInputChange('skinColor', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hairColor">Hair Color</Label>
                  <Input
                    id="hairColor"
                    value={formData.hairColor || ''}
                    onChange={(e) => handleInputChange('hairColor', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="eyeColor">Eye Color</Label>
                  <Input
                    id="eyeColor"
                    value={formData.eyeColor || ''}
                    onChange={(e) => handleInputChange('eyeColor', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="children">Children Status</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      'No children',
                      'Have children',
                      'Want children',
                      "Don't want children"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`children-${option}`}
                          checked={Array.isArray(formData.children) ? formData.children.includes(option) : false}
                          onCheckedChange={(checked) => {
                            const currentChildren = Array.isArray(formData.children) ? formData.children : [];
                            const newChildren = checked 
                              ? [...currentChildren, option]
                              : currentChildren.filter(c => c !== option);
                            handleInputChange('children', newChildren);
                          }}
                        />
                        <label 
                          htmlFor={`children-${option}`} 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {Array.isArray(formData.children) && formData.children.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">Selected: {formData.children.join(', ')}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="smoking">Smoking Status</Label>
                  <Select
                    value={formData.smoking || ''}
                    onValueChange={(value) => handleInputChange('smoking', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select smoking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Non-smoker">Non-smoker</SelectItem>
                      <SelectItem value="Social smoker">Social smoker</SelectItem>
                      <SelectItem value="Regular smoker">Regular smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="drinking">Drinking Status</Label>
                  <Select
                    value={formData.drinking || ''}
                    onValueChange={(value) => handleInputChange('drinking', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select drinking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Never">Never</SelectItem>
                      <SelectItem value="Rarely">Rarely</SelectItem>
                      <SelectItem value="Socially">Socially</SelectItem>
                      <SelectItem value="Regularly">Regularly</SelectItem>
                      <SelectItem value="Frequently">Frequently</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages and Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Languages & Interests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input
                  id="languages"
                  value={Array.isArray(formData.languages) ? formData.languages.join(', ') : formData.languages || ''}
                  onChange={(e) => handleInputChange('languages', e.target.value.split(', ').filter(Boolean))}
                  placeholder="e.g., Spanish, English, French"
                />
              </div>
              <div>
                <Label htmlFor="interests">Interests & Hobbies</Label>
                <Input
                  id="interests"
                  value={Array.isArray(formData.interests) ? formData.interests.join(', ') : formData.interests || ''}
                  onChange={(e) => handleInputChange('interests', e.target.value.split(', ').filter(Boolean))}
                  placeholder="e.g., Dancing, Cooking, Reading, Travel"
                />
              </div>
              <div>
                <Label htmlFor="lookingFor">Looking For</Label>
                <Input
                  id="lookingFor"
                  value={Array.isArray(formData.lookingFor) ? formData.lookingFor.join(', ') : formData.lookingFor || ''}
                  onChange={(e) => handleInputChange('lookingFor', e.target.value.split(', ').filter(Boolean))}
                  placeholder="e.g., Serious relationship, Marriage, Friendship"
                />
              </div>
            </CardContent>
          </Card>

          {/* About Me */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="aboutMe">Tell us about yourself</Label>
                <Textarea
                  id="aboutMe"
                  value={formData.aboutMe || ''}
                  onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                  rows={4}
                  placeholder="Share something interesting about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Photos and Media */}
          <Card>
            <CardHeader>
              <CardTitle>Photos and Media</CardTitle>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Active Photos: {(formData.photos?.length || 0) - (formData.inactivePhotos?.length || 0)}
                </div>
                <div className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  Inactive Photos: {formData.inactivePhotos?.length || 0}
                </div>
                <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Active Videos: {(formData.videos?.length || 0) - (formData.inactiveVideos?.length || 0)}
                </div>
                <div className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  Inactive Videos: {formData.inactiveVideos?.length || 0}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* UNIFIED UPLOAD AREA - MATCHES LIVE SITE */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Photos & Videos</h3>
                    <p className="text-gray-600 mb-4">Drag and drop your media files here, or click to browse</p>
                    <Button 
                      type="button" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                      onClick={() => document.getElementById('unified-media-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Choose Files'}
                    </Button>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        
                        setIsUploading(true);
                        
                        try {
                          // Create FormData for file upload
                          const uploadFormData = new FormData();
                          files.forEach(file => {
                            uploadFormData.append('files', file);
                          });
                          
                          // Upload files to server
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: uploadFormData,
                          });
                          
                          if (!response.ok) {
                            throw new Error('Upload failed');
                          }
                          
                          const uploadResult = await response.json();
                          console.log('🔍 Upload result:', uploadResult);
                          
                          // Process uploaded files
                          const currentPhotos = formData.photos || [];
                          const currentVideos = formData.videos || [];
                          const newPhotos = [...currentPhotos];
                          const newVideos = [...currentVideos];
                          
                          uploadResult.files.forEach((file: any) => {
                            if (file.mimetype.startsWith('image/')) {
                              newPhotos.push(file.url);
                            } else if (file.mimetype.startsWith('video/')) {
                              newVideos.push(file.url);
                            }
                          });
                          
                          // Update form data
                          handleInputChange('photos', newPhotos);
                          handleInputChange('videos', newVideos);
                          
                          // Set primary photo if none exists
                          if (!formData.primaryPhoto && newPhotos.length > currentPhotos.length) {
                            handleInputChange('primaryPhoto', newPhotos[currentPhotos.length]);
                          }
                          
                          // Clear file input
                          e.target.value = '';
                          
                        } catch (error) {
                          console.error('Upload error:', error);
                          alert('Upload failed. Please try again.');
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                      className="hidden"
                      id="unified-media-upload"
                    />
                  </div>
                </div>
                
                {/* MEDIA GUIDELINES - MATCHES LIVE SITE */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-blue-900 mb-2">Media Guidelines:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 text-left">
                    <li>• Upload up to 10 photos and videos (any mix)</li>
                    <li>• Accepted formats: JPG, PNG, MP4, MOV, AVI</li>
                    <li>• Maximum file size: 10MB per file</li>
                    <li>• Videos should be under 2 minutes for best performance</li>
                    <li>• 3 slots remaining</li>
                  </ul>
                </div>
              </div>

              {/* PHOTOS SECTION */}
              {formData.photos && formData.photos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Photos ({formData.photos.length})
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="space-y-2">
                        <div className={`relative overflow-hidden rounded-lg border-2 bg-gray-100 ${
                          formData.inactivePhotos?.includes(photo) 
                            ? 'border-red-300 opacity-50' 
                            : 'border-gray-200'
                        }`}>
                          <img 
                            src={getMediaUrl(photo, 'image')} 
                            alt={`Photo ${index + 1}`}
                            className={`w-full h-40 object-cover ${
                              formData.inactivePhotos?.includes(photo) ? 'grayscale' : ''
                            }`}
                            loading="lazy"
                          />
                          
                          {/* Primary Photo Badge */}
                          {formData.primaryPhoto === photo && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                              ⭐ Primary
                            </div>
                          )}
                        </div>
                        
                        {/* Photo Controls */}
                        <div className="space-y-2">
                          <p className="text-xs text-gray-600 truncate" title={photo}>{photo}</p>
                          
                          {/* Primary Selection */}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={formData.primaryPhoto === photo}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleInputChange('primaryPhoto', photo);
                                  setTimeout(() => {
                                    updateMutation.mutate({ primaryPhoto: photo });
                                  }, 100);
                                }
                              }}
                              className="h-4 w-4"
                            />
                            <Label className="text-xs font-medium text-gray-700">Primary Photo</Label>
                          </div>
                          
                          {/* Active/Inactive Toggle */}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={!(formData.inactivePhotos?.includes(photo) || false)}
                              onCheckedChange={(checked) => {
                                const inactivePhotos = formData.inactivePhotos || [];
                                if (checked) {
                                  const newInactive = inactivePhotos.filter(p => p !== photo);
                                  handleInputChange('inactivePhotos', newInactive);
                                  setTimeout(() => {
                                    updateMutation.mutate({ inactivePhotos: newInactive });
                                  }, 100);
                                } else {
                                  const newInactive = [...inactivePhotos, photo];
                                  handleInputChange('inactivePhotos', newInactive);
                                  setTimeout(() => {
                                    updateMutation.mutate({ inactivePhotos: newInactive });
                                  }, 100);
                                }
                              }}
                              className="h-4 w-4"
                            />
                            <Label className="text-xs font-medium text-gray-700">
                              {(formData.inactivePhotos?.includes(photo) || false) ? 'Inactive' : 'Active'}
                            </Label>
                          </div>
                          
                          {/* Remove Button */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newPhotos = formData.photos.filter((_, i) => i !== index);
                              handleInputChange('photos', newPhotos);
                              if (formData.primaryPhoto === photo) {
                                handleInputChange('primaryPhoto', newPhotos[0] || '');
                              }
                            }}
                            className="text-xs px-2 py-1 h-6 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIDEOS SECTION */}
              {formData.videos && formData.videos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" clipRule="evenodd" />
                    </svg>
                    Videos ({formData.videos.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.videos.map((video, index) => (
                      <div key={index} className="space-y-2">
                        <div className={`relative overflow-hidden rounded-lg border-2 bg-gray-100 ${
                          formData.inactiveVideos?.includes(video) 
                            ? 'border-red-300 opacity-50' 
                            : 'border-gray-200'
                        }`}>
                          <video 
                            src={getMediaUrl(video, 'video')}
                            className="w-full h-48 object-cover"
                            controls
                            muted
                            preload="metadata"
                          />
                        </div>
                        
                        {/* Video Controls */}
                        <div className="space-y-2">
                          <p className="text-xs text-gray-600 truncate" title={video}>{video}</p>
                          
                          {/* Active/Inactive Toggle */}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={!(formData.inactiveVideos?.includes(video) || false)}
                              onCheckedChange={(checked) => {
                                const inactiveVideos = formData.inactiveVideos || [];
                                if (checked) {
                                  const newInactive = inactiveVideos.filter(v => v !== video);
                                  handleInputChange('inactiveVideos', newInactive);
                                  setTimeout(() => {
                                    updateMutation.mutate({ inactiveVideos: newInactive });
                                  }, 100);
                                } else {
                                  const newInactive = [...inactiveVideos, video];
                                  handleInputChange('inactiveVideos', newInactive);
                                  setTimeout(() => {
                                    updateMutation.mutate({ inactiveVideos: newInactive });
                                  }, 100);
                                }
                              }}
                              className="h-4 w-4"
                            />
                            <Label className="text-xs font-medium text-gray-700">
                              {(formData.inactiveVideos?.includes(video) || false) ? 'Inactive' : 'Active'}
                            </Label>
                          </div>
                          
                          {/* Remove Button */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newVideos = formData.videos.filter((_, i) => i !== index);
                              handleInputChange('videos', newVideos);
                            }}
                            className="text-xs px-2 py-1 h-6 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactWhatsapp">WhatsApp</Label>
                  <Input
                    id="contactWhatsapp"
                    value={formData.contactWhatsapp || ''}
                    onChange={(e) => handleInputChange('contactWhatsapp', e.target.value)}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="contactInstagram">Instagram</Label>
                  <Input
                    id="contactInstagram"
                    value={formData.contactInstagram || ''}
                    onChange={(e) => handleInputChange('contactInstagram', e.target.value)}
                    placeholder="e.g., @username"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail || ''}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="e.g., contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone || ''}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="contactTelegram">Telegram</Label>
                  <Input
                    id="contactTelegram"
                    value={formData.contactTelegram || ''}
                    onChange={(e) => handleInputChange('contactTelegram', e.target.value)}
                    placeholder="e.g., @telegram_username"
                  />
                </div>
                <div>
                  <Label htmlFor="contactFacebook">Facebook</Label>
                  <Input
                    id="contactFacebook"
                    value={formData.contactFacebook || ''}
                    onChange={(e) => handleInputChange('contactFacebook', e.target.value)}
                    placeholder="e.g., facebook.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="contactTiktok">TikTok</Label>
                  <Input
                    id="contactTiktok"
                    value={formData.contactTiktok || ''}
                    onChange={(e) => handleInputChange('contactTiktok', e.target.value)}
                    placeholder="e.g., @tiktok_username"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Contact Information Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    placeholder="e.g., 29.99"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Status */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Profile Status</Label>
                <Select
                  value={formData.status || 'PENDING'}
                  onValueChange={(value) => {
                    handleInputChange('status', value);
                    // Update isApproved based on status
                    if (value === 'ACTIVE') {
                      handleInputChange('isApproved', true);
                    } else {
                      handleInputChange('isApproved', false);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.isFeatured || false}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                />
                <Label>Featured</Label>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleInputChange('status', 'ACTIVE');
                    handleInputChange('isApproved', true);
                  }}
                  className="flex-1"
                >
                  Approve Profile
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleInputChange('isFeatured', !formData.isFeatured);
                  }}
                  className="flex-1"
                >
                  {formData.isFeatured ? 'Remove Featured' : 'Make Featured'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </form>
      </div>
      <AdminFooterLogout />
    </div>
  );
}
