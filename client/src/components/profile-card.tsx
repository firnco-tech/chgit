import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Profile } from "@shared/schema";

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
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
            src={profile.photos?.[0] || '/placeholder-profile.jpg'}
            alt={`${profile.firstName} profile photo`}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>
      
      <CardContent className="p-6">
        <Link href={`/profile/${profile.id}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary">
            {profile.firstName}, {profile.age}
          </h3>
        </Link>
        <p className="text-gray-600 mb-2">{profile.location}</p>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {profile.aboutMe || 'No description available'}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-primary font-semibold">
            ${profile.price} Contact
          </span>
          <Button 
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary/90"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
