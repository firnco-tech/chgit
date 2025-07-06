import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteHeart } from "@/components/FavoriteHeart";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Profile } from "@shared/schema";

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const { addItem, items } = useCart();
  const { toast } = useToast();

  const isInCart = items.some(item => item.id === profile.id);

  const handleAddToCart = () => {
    if (isInCart) {
      return; // Don't add if already in cart
    }
    
    addItem({
      id: profile.id,
      name: `${profile.firstName}, ${profile.age}`,
      age: profile.age,
      location: profile.location,
      photo: profile.photos?.[0] || '',
      price: parseFloat(profile.price)
    });
    
    toast({
      title: "Added to cart",
      description: `${profile.firstName}'s contact information has been added to your cart.`
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <Link href={`/profile/${profile.id}`}>
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={profile.photos?.[0] 
              ? (profile.photos[0].startsWith('data:') || profile.photos[0].startsWith('http') 
                  ? profile.photos[0] 
                  : `https://picsum.photos/300/400?random=${profile.id}`)
              : `https://picsum.photos/300/400?random=${profile.id + 1000}`}
            alt={`${profile.firstName} profile photo`}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/300/400?random=${profile.id + 2000}`;
            }}
          />
        </div>
      </Link>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <Link href={`/profile/${profile.id}`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary">
                {profile.firstName}, {profile.age}
              </h3>
            </Link>
            <p className="text-gray-600 mb-2">{profile.location}</p>
          </div>
          <FavoriteHeart profileId={profile.id} size="lg" />
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {profile.aboutMe || 'No description available'}
        </p>
        
        <div className="flex justify-end items-center">
          <Button 
            onClick={handleAddToCart}
            disabled={isInCart}
            className={isInCart 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-primary hover:bg-primary/90"
            }
          >
            {isInCart ? "IN CART" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
