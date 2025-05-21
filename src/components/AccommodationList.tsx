
"use client";

import Link from "next/link";
import Image from "next/image";
import { Accommodation, AccommodationSearchCriteria, getAvailableAccommodations, getAllAccommodations } from "@/services/accommodation";
import { addToFavorites, removeFromFavorites, isFavorite as checkIsFavorite } from "@/services/favorites";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { formatISO } from "date-fns";

interface AccommodationListProps {
  searchCriteria?: AccommodationSearchCriteria; // Make searchCriteria optional
}

// Extend Accommodation type locally to include dynamic favorite status
type AccommodationWithFavorite = Accommodation & { isFavoritedDynamic?: boolean; isFavoriteLoading?: boolean };

const AccommodationList: React.FC<AccommodationListProps> = ({ searchCriteria }) => {
  const [accommodations, setAccommodations] = useState<AccommodationWithFavorite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccommodationsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let data: Accommodation[];
        if (searchCriteria) {
          data = await getAvailableAccommodations(searchCriteria);
        } else {
          data = await getAllAccommodations(); // Fetch all if no criteria
        }
        
        const accommodationsWithStatus = await Promise.all(
          data.map(async (acc) => {
            const isFav = await checkIsFavorite(acc.id);
            return { ...acc, isFavoritedDynamic: isFav, isFavoriteLoading: false };
          })
        );
        setAccommodations(accommodationsWithStatus);
      } catch (err: any) {
        setError(err.message || "Failed to fetch accommodations");
        setAccommodations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodationsData();
  }, [searchCriteria]);

  const handleToggleFavorite = async (e: React.MouseEvent, accommodationId: string, accommodationName: string) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button
    e.stopPropagation();

    setAccommodations(prev => 
      prev.map(acc => acc.id === accommodationId ? { ...acc, isFavoriteLoading: true } : acc)
    );

    const currentAccommodation = accommodations.find(acc => acc.id === accommodationId);
    if (!currentAccommodation) return;

    try {
      if (currentAccommodation.isFavoritedDynamic) {
        await removeFromFavorites(accommodationId);
        toast({ title: "Removed from Favorites", description: `${accommodationName} removed from favorites.` });
      } else {
        await addToFavorites(accommodationId);
        toast({ title: "Added to Favorites!", description: `${accommodationName} added to favorites.` });
      }
      // Update local state
      setAccommodations(prev => 
        prev.map(acc => 
          acc.id === accommodationId 
            ? { ...acc, isFavoritedDynamic: !acc.isFavoritedDynamic, isFavoriteLoading: false } 
            : acc
        )
      );
    } catch (error) {
      toast({ title: "Error", description: "Could not update favorites. Please try again.", variant: "destructive" });
      setAccommodations(prev => 
        prev.map(acc => acc.id === accommodationId ? { ...acc, isFavoriteLoading: false } : acc)
      );
    }
  };


  if (isLoading) {
    return <div className="text-center py-10">Loading accommodations...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive">Error: {error}</div>;
  }

  if (accommodations.length === 0) {
    return <div className="text-center py-10">No accommodations found.</div>;
  }

  const buildAccommodationLink = (accommodationId: string) => {
    if (searchCriteria && searchCriteria.checkInDate && searchCriteria.checkOutDate && searchCriteria.numberOfGuests) {
      const params = new URLSearchParams();
      params.append("checkIn", formatISO(searchCriteria.checkInDate, { representation: 'date' }));
      params.append("checkOut", formatISO(searchCriteria.checkOutDate, { representation: 'date' }));
      params.append("guests", searchCriteria.numberOfGuests.toString());
      return `/accommodation/${accommodationId}?${params.toString()}`;
    }
    // Fallback if searchCriteria or its specific properties are not available
    return `/accommodation/${accommodationId}`;
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {accommodations.map((accommodation) => (
        <Link key={accommodation.id} href={buildAccommodationLink(accommodation.id)} passHref>
          <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
            <div className="relative w-full h-48">
              {accommodation.imageUrls.length > 0 && (
                <Image
                  src={accommodation.imageUrls[0]}
                  alt={accommodation.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  data-ai-hint={accommodation.type === 'Apartment' ? "apartment exterior" : accommodation.type === 'Villa' ? "villa exterior" : "cabin exterior"}
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleToggleFavorite(e, accommodation.id, accommodation.name)}
                disabled={accommodation.isFavoriteLoading}
                aria-label={accommodation.isFavoritedDynamic ? "Remove from favorites" : "Add to favorites"}
                className="absolute top-2 right-2 bg-background/70 hover:bg-background text-destructive hover:text-destructive/80 rounded-full p-1 z-10"
              >
                {accommodation.isFavoriteLoading ? (
                  <Icons.loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Icons.heart className={`h-5 w-5 ${accommodation.isFavoritedDynamic ? "fill-destructive" : "text-destructive/70"}`} />
                )}
              </Button>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl truncate">{accommodation.name}</CardTitle>
              <Badge variant="secondary" className="w-fit">{accommodation.type}</Badge>
            </CardHeader>
            <CardContent className="flex-grow pb-2">
              <CardDescription className="line-clamp-3">{accommodation.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-2">
              <p className="text-lg font-semibold">${accommodation.pricePerNight}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
              <div className="flex items-center">
                <Icons.star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm text-muted-foreground">{accommodation.rating} ({accommodation.reviewsCount})</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default AccommodationList;

