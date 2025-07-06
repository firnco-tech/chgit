import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FavoriteHeartProps {
  profileId: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FavoriteHeart({ profileId, size = "md", className = "" }: FavoriteHeartProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if profile is favorited
  const { data: favoriteStatus } = useQuery({
    queryKey: [`/api/favorites/${profileId}/status`],
    retry: false,
  });

  const isFavorited = favoriteStatus?.isFavorited || false;

  // Add/remove favorite mutation
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        await apiRequest(`/api/favorites/${profileId}`, {
          method: "DELETE",
        });
        return false;
      } else {
        await apiRequest(`/api/favorites/${profileId}`, {
          method: "POST",
        });
        return true;
      }
    },
    onSuccess: (newFavoriteStatus) => {
      // Invalidate and refetch favorite status
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/${profileId}/status`] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      
      toast({
        title: newFavoriteStatus ? "Added to Favorites" : "Removed from Favorites",
        description: newFavoriteStatus 
          ? "Profile has been added to your favorites" 
          : "Profile has been removed from your favorites",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favoriteMutation.mutate();
  };

  // Size classes
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10"
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={favoriteMutation.isPending}
      className={`
        inline-flex items-center justify-center
        transition-all duration-200
        hover:scale-110 active:scale-95
        ${favoriteMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`
          ${sizeClasses[size]}
          transition-colors duration-200
          ${isFavorited 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-400 hover:text-red-400'
          }
        `}
      />
    </button>
  );
}