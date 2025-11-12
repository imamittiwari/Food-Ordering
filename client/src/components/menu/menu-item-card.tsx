import { useState } from "react";
import { Heart, Star, Leaf, Wheat, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { MenuItem } from "@shared/schema";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart",
        variant: "destructive"
      });
      return;
    }
    
    addItem({
      id: 0, // Will be set by the server
      userId: user.id,
      menuItemId: item.id,
      quantity: 1,
      selectedAddons: null,
      specialInstructions: null,
      menuItem: item
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow border">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.imageUrl || undefined}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-background rounded-full p-1.5 shadow-sm border">
          <button
            onClick={toggleFavorite}
            className={cn(
              "transition-colors",
              isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-card-foreground">{item.name}</h3>
          <div className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs flex items-center">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400" />
            {(item.rating || 0).toFixed(1)}
          </div>
        </div>

        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.description}</p>

        {/* Dietary Preferences */}
        {item.dietaryPreferences && Array.isArray(item.dietaryPreferences) && item.dietaryPreferences.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {(item.dietaryPreferences as string[]).map((pref: string) => (
              <Badge key={pref} variant="secondary" className="text-xs">
                {pref === 'vegetarian' && <Leaf className="h-3 w-3 mr-1" />}
                {pref === 'vegan' && <Leaf className="h-3 w-3 mr-1" />}
                {pref === 'gluten-free' && <Wheat className="h-3 w-3 mr-1" />}
                {pref}
              </Badge>
            ))}
          </div>
        )}

        {/* Nutritional Info */}
        {item.nutritionalInfo && typeof item.nutritionalInfo === 'object' && (item.nutritionalInfo as any).calories && (
          <div className="mt-2 text-xs text-muted-foreground">
            <span>{(item.nutritionalInfo as any).calories} cal</span>
          </div>
        )}

        {/* Combo Badge */}
        {item.isCombo && (
          <Badge className="mt-2 bg-primary text-primary-foreground">
            Combo Deal
          </Badge>
        )}

        {/* Seasonal Badge */}
        {item.isSeasonal && (
          <Badge className="mt-2 bg-orange-500 text-white">
            Seasonal
          </Badge>
        )}

        <div className="mt-4 flex justify-between items-center">
          <Price value={item.price} />
          <Button
            onClick={handleAddToCart}
            variant="default"
            className="rounded-lg text-sm"
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
