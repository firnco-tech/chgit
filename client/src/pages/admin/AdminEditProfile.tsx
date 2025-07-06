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
import { ArrowLeft, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
  hasChildren?: boolean;
  wantsChildren?: boolean;
  smokingStatus?: string;
  drinkingStatus?: string;
  aboutMe?: string;
  interests?: string[];
  languages?: string[];
  lookingFor?: string[];
  photos?: string[];
  videos?: string[];
  primaryPhoto?: string;
  appearance?: string;
  contactMethods?: string[];
  contactWhatsapp?: string;
  contactInstagram?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactTelegram?: string;
  contactFacebook?: string;
  contactTiktok?: string;
  price?: number;
  isApproved?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminEditProfile() {
  const params = useParams();
  const profileId = parseInt(params.id as string);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<Partial<Profile>>({});

  // Fetch profile data
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: [`/api/admin/profiles/${profileId}`],
    enabled: !!profileId,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      return await apiRequest("PATCH", `/api/admin/profiles/${profileId}`, data);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up the form data before submitting
    const cleanedData = {
      ...formData,
      // Ensure arrays are properly formatted
      photos: Array.isArray(formData.photos) ? formData.photos : [],
      videos: Array.isArray(formData.videos) ? formData.videos : [],
      interests: Array.isArray(formData.interests) ? formData.interests : [],
      languages: Array.isArray(formData.languages) ? formData.languages : [],
      lookingFor: Array.isArray(formData.lookingFor) ? formData.lookingFor : [],
      contactMethods: Array.isArray(formData.contactMethods) ? formData.contactMethods : [],
      // Convert string values to numbers where needed
      age: typeof formData.age === 'string' ? parseInt(formData.age) : formData.age,
      price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
      // Convert string values to boolean where needed
      hasChildren: typeof formData.hasChildren === 'string' ? formData.hasChildren === 'true' : formData.hasChildren,
      wantsChildren: typeof formData.wantsChildren === 'string' ? formData.wantsChildren === 'true' : formData.wantsChildren,
      isApproved: typeof formData.isApproved === 'string' ? formData.isApproved === 'true' : formData.isApproved,
      isFeatured: typeof formData.isFeatured === 'string' ? formData.isFeatured === 'true' : formData.isFeatured,
    };
    
    console.log('Submitting form data:', cleanedData);
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
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Profile: {profile.firstName} {profile.lastName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              profile.isApproved 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {profile.isApproved ? 'APPROVED' : 'PENDING'}
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
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
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
                      <SelectItem value="4'8">4'8"</SelectItem>
                      <SelectItem value="4'9">4'9"</SelectItem>
                      <SelectItem value="4'10">4'10"</SelectItem>
                      <SelectItem value="4'11">4'11"</SelectItem>
                      <SelectItem value="5'0">5'0"</SelectItem>
                      <SelectItem value="5'1">5'1"</SelectItem>
                      <SelectItem value="5'2">5'2"</SelectItem>
                      <SelectItem value="5'3">5'3"</SelectItem>
                      <SelectItem value="5'4">5'4"</SelectItem>
                      <SelectItem value="5'5">5'5"</SelectItem>
                      <SelectItem value="5'6">5'6"</SelectItem>
                      <SelectItem value="5'7">5'7"</SelectItem>
                      <SelectItem value="5'8">5'8"</SelectItem>
                      <SelectItem value="5'9">5'9"</SelectItem>
                      <SelectItem value="5'10">5'10"</SelectItem>
                      <SelectItem value="5'11">5'11"</SelectItem>
                      <SelectItem value="6'0">6'0"</SelectItem>
                      <SelectItem value="6'1">6'1"</SelectItem>
                      <SelectItem value="6'2">6'2"</SelectItem>
                      <SelectItem value="6'3">6'3"</SelectItem>
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasChildren"
                    checked={formData.hasChildren || false}
                    onCheckedChange={(checked) => handleInputChange('hasChildren', checked)}
                  />
                  <Label htmlFor="hasChildren">Has Children</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wantsChildren"
                    checked={formData.wantsChildren || false}
                    onCheckedChange={(checked) => handleInputChange('wantsChildren', checked)}
                  />
                  <Label htmlFor="wantsChildren">Wants Children</Label>
                </div>
                <div>
                  <Label htmlFor="smokingStatus">Smoking Status</Label>
                  <Select
                    value={formData.smokingStatus || ''}
                    onValueChange={(value) => handleInputChange('smokingStatus', value)}
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
                  <Label htmlFor="drinkingStatus">Drinking Status</Label>
                  <Select
                    value={formData.drinkingStatus || ''}
                    onValueChange={(value) => handleInputChange('drinkingStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select drinking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Non-drinker">Non-drinker</SelectItem>
                      <SelectItem value="Social drinker">Social drinker</SelectItem>
                      <SelectItem value="Regular drinker">Regular drinker</SelectItem>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Current Photos</Label>
                {formData.photos && formData.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={photo.startsWith('data:') ? photo : `/uploads/${photo}`} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f3f4f6"/><text x="50" y="50" text-anchor="middle" font-size="10" fill="#9ca3af">Image</text></svg>')}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={formData.primaryPhoto === photo}
                              onCheckedChange={(checked) => {
                                if (checked) handleInputChange('primaryPhoto', photo);
                              }}
                              className="bg-white"
                            />
                            <Label className="text-xs text-white">Primary</Label>
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
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        {formData.primaryPhoto === photo && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No photos uploaded</p>
                )}
                
                <div className="mt-4">
                  <Label className="text-sm font-medium">Add New Photos</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const fileNames = files.map(file => file.name);
                        const currentPhotos = formData.photos || [];
                        const newPhotos = [...currentPhotos, ...fileNames];
                        handleInputChange('photos', newPhotos);
                        if (!formData.primaryPhoto && fileNames.length > 0) {
                          handleInputChange('primaryPhoto', fileNames[0]);
                        }
                      }}
                      className="hidden"
                      id="admin-photo-upload"
                    />
                    <label htmlFor="admin-photo-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600">Click to upload photos</div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Current Videos</Label>
                {formData.videos && formData.videos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video 
                          src={video.startsWith('data:') ? video : `/uploads/${video}`} 
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          controls
                          preload="metadata"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-32 rounded-lg border-2 border-gray-200 bg-gray-100 flex items-center justify-center" style={{display: 'none'}}>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Video</div>
                            <div className="text-xs text-gray-500">{video}</div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newVideos = formData.videos.filter((_, i) => i !== index);
                              handleInputChange('videos', newVideos);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No videos uploaded</p>
                )}
                
                <div className="mt-4">
                  <Label className="text-sm font-medium">Add New Videos</Label>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center mt-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const fileNames = files.map(file => file.name);
                        const currentVideos = formData.videos || [];
                        handleInputChange('videos', [...currentVideos, ...fileNames]);
                      }}
                      className="hidden"
                      id="admin-video-upload"
                    />
                    <label htmlFor="admin-video-upload" className="cursor-pointer">
                      <div className="text-sm text-gray-600">Click to upload videos</div>
                    </label>
                  </div>
                </div>
              </div>
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
                    placeholder="WhatsApp number"
                  />
                </div>
                <div>
                  <Label htmlFor="contactInstagram">Instagram</Label>
                  <Input
                    id="contactInstagram"
                    value={formData.contactInstagram || ''}
                    onChange={(e) => handleInputChange('contactInstagram', e.target.value)}
                    placeholder="Instagram handle"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail || ''}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label htmlFor="contactTelegram">Telegram</Label>
                  <Input
                    id="contactTelegram"
                    value={formData.contactTelegram || ''}
                    onChange={(e) => handleInputChange('contactTelegram', e.target.value)}
                    placeholder="Telegram username"
                  />
                </div>
                <div>
                  <Label htmlFor="contactFacebook">Facebook</Label>
                  <Input
                    id="contactFacebook"
                    value={formData.contactFacebook || ''}
                    onChange={(e) => handleInputChange('contactFacebook', e.target.value)}
                    placeholder="Facebook profile"
                  />
                </div>
                <div>
                  <Label htmlFor="contactTiktok">TikTok</Label>
                  <Input
                    id="contactTiktok"
                    value={formData.contactTiktok || ''}
                    onChange={(e) => handleInputChange('contactTiktok', e.target.value)}
                    placeholder="TikTok handle"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Contact Information Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  placeholder="Price for contact information access"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isApproved"
                  checked={formData.isApproved || false}
                  onCheckedChange={(checked) => handleInputChange('isApproved', checked)}
                />
                <Label htmlFor="isApproved">Approved</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured || false}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
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
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}