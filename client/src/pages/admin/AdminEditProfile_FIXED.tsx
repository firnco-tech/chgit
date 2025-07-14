import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Upload, X } from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminFooterLogout } from "@/components/admin/AdminFooterLogout";

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  height: string;
  location: string;
  education: string;
  occupation: string;
  occupationDetails: string;
  languages: string[];
  relationshipStatus: string;
  children: string[];
  smoking: string;
  drinking: string;
  bodyType: string;
  aboutMe: string;
  lookingFor: string[];
  interests: string[];
  photos: string[];
  videos: string[];
  primaryPhoto: string;
  appearance: string;
  contactMethods: any;
  price: number;
  status: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  inactivePhotos: string[];
  inactiveVideos: string[];
}

function getMediaUrl(filename: string, type: 'image' | 'video'): string {
  if (filename.startsWith('http')) {
    return filename;
  }
  return `/${type}s/${filename}`;
}

export default function AdminEditProfile() {
  const params = useParams();
  const profileId = parseInt(params.id as string);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<Profile>>({});

  // Fetch profile data
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: [`/api/admin/profiles/${profileId}`],
    enabled: !!profileId,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      console.log('🔍 ADMIN PANEL DEBUG - Profile loaded:', profile);
      setFormData(profile);
    }
  }, [profile]);

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
    const { createdAt, updatedAt, ...updateableData } = formData;
    const cleanedData = {
      ...updateableData,
      photos: Array.isArray(formData.photos) ? formData.photos : [],
      videos: Array.isArray(formData.videos) ? formData.videos : [],
      inactivePhotos: Array.isArray(formData.inactivePhotos) ? formData.inactivePhotos : [],
      inactiveVideos: Array.isArray(formData.inactiveVideos) ? formData.inactiveVideos : [],
      age: typeof formData.age === 'string' ? parseInt(formData.age) : formData.age,
      price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
      isApproved: typeof formData.isApproved === 'string' ? formData.isApproved === 'true' : formData.isApproved,
      isFeatured: typeof formData.isFeatured === 'string' ? formData.isFeatured === 'true' : formData.isFeatured,
    };
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
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              profile.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {profile.isApproved ? 'ACTIVE' : 'PENDING'}
            </span>
            {profile.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                FEATURED
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos and Media - RESTORED UNIFIED INTERFACE */}
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
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Photos & Videos</h3>
                    <p className="text-gray-600 mb-4">Drag and drop your media files here, or click to browse</p>
                    <Button 
                      type="button" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                      onClick={() => document.getElementById('unified-media-upload')?.click()}
                    >
                      Choose Files
                    </Button>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const photoFiles = files.filter(file => file.type.startsWith('image/'));
                        const videoFiles = files.filter(file => file.type.startsWith('video/'));
                        
                        if (photoFiles.length > 0) {
                          const photoNames = photoFiles.map(file => file.name);
                          const currentPhotos = formData.photos || [];
                          const newPhotos = [...currentPhotos, ...photoNames];
                          handleInputChange('photos', newPhotos);
                          if (!formData.primaryPhoto && photoNames.length > 0) {
                            handleInputChange('primaryPhoto', photoNames[0]);
                          }
                        }
                        
                        if (videoFiles.length > 0) {
                          const videoNames = videoFiles.map(file => file.name);
                          const currentVideos = formData.videos || [];
                          handleInputChange('videos', [...currentVideos, ...videoNames]);
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
                      <div key={index} className="relative group">
                        <img 
                          src={getMediaUrl(photo, 'image')} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        {formData.primaryPhoto === photo && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newPhotos = formData.photos.filter((_, i) => i !== index);
                            handleInputChange('photos', newPhotos);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
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
                      <div key={index} className="relative group">
                        <video 
                          src={getMediaUrl(video, 'video')}
                          className="w-full h-48 object-cover rounded-lg border"
                          controls
                          muted
                          preload="metadata"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newVideos = formData.videos.filter((_, i) => i !== index);
                            handleInputChange('videos', newVideos);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
      
      <AdminFooterLogout />
    </div>
  );
}