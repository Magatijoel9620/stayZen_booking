
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
import { Skeleton } from "@/components/ui/skeleton";

interface AccommodationListProps {
  searchCriteria?: AccommodationSearchCriteria; // Make searchCriteria optional
}

// Extend Accommodation type locally to include dynamic favorite status
type AccommodationWithFavorite = Accommodation & { isFavoritedDynamic?: boolean; isFavoriteLoading?: boolean };

const AccommodationListSkeleton: React.FC = () => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg">
          <Skeleton className="relative w-full h-48 rounded-t-lg" />
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-1" /> {/* Title */}
            <Skeleton className="h-4 w-1/4" />      {/* Badge */}
          </CardHeader>
          <CardContent className="flex-grow pb-2">
            <Skeleton className="h-4 w-full mb-1" /> {/* Description line 1 */}
            <Skeleton className="h-4 w-5/6" />       {/* Description line 2 */}
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-1/3" /> {/* Price */}
            <Skeleton className="h-5 w-1/4" /> {/* Rating */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};


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
    return <AccommodationListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-10 px-6 text-destructive bg-destructive/10 rounded-xl shadow-sm mt-6">
        <Icons.alertTriangle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4" />
        <p className="text-xl sm:text-2xl font-semibold mb-2">Error Loading Accommodations</p>
        <p className="text-sm sm:text-base max-w-md mx-auto mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          <Icons.refreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (accommodations.length === 0) {
    return (
      <div className="text-center py-10 px-6 text-muted-foreground bg-card border-2 border-dashed border-border/70 rounded-xl shadow-sm mt-6">
        <Icons.search className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 text-primary/50" />
        <p className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
          No Accommodations Found
        </p>
        {searchCriteria ? (
          <p className="text-sm sm:text-base max-w-md mx-auto mb-4">
            Try adjusting your search dates or guest count.
          </p>
        ) : (
          <p className="text-sm sm:text-base max-w-md mx-auto mb-4">
            It seems we don't have any accommodations listed right now. Check back soon!
          </p>
        )}
        <Link href="/all-accommodations" passHref>
          <Button variant="outline">
            <Icons.layoutGrid className="mr-2 h-4 w-4" />
            View All Accommodations
          </Button>
        </Link>
      </div>
    );
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
      {accommodations.map((accommodation) => {
        const hint = accommodation.type === 'Apartment' ? "apartment exterior" : accommodation.type === 'Villa' ? "villa exterior" : "cabin exterior";
        const imageUrl = `https://source.unsplash.com/600x400/?${hint.split(' ').join(',')}`;
        return (
        <Link key={accommodation.id} href={buildAccommodationLink(accommodation.id)} passHref className="group">
          <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <div className="relative w-full h-48">
              {accommodation.imageUrls.length > 0 && ( // This condition can be removed
                <Image
                  src={imageUrl}
                  alt={accommodation.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={hint}
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
              <CardTitle className="text-xl truncate group-hover:text-primary transition-colors">{accommodation.name}</CardTitle>
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
      );
    })}
    </div>
  );
};

export default AccommodationList;
