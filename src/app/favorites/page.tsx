
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Accommodation } from "@/services/accommodation";
import { getFavoriteAccommodations, removeFromFavorites, isFavorite as checkIsFavorite } from "@/services/favorites";
import { useToast } from "@/hooks/use-toast";

export default function FavoritesPage() {
  const [favoriteAccommodations, setFavoriteAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFavoriteAccommodations();
      // Attach isFavorited status locally for UI rendering, since all items here are favorites by definition
      const accommodationsWithStatus = data.map(acc => ({ ...acc, isFavoritedDynamic: true }));
      setFavoriteAccommodations(accommodationsWithStatus as any); // Cast to handle local state extension
    } catch (err: any) {
      setError(err.message || "Failed to load favorites.");
      setFavoriteAccommodations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = async (accommodationId: string, accommodationName: string) => {
    try {
      await removeFromFavorites(accommodationId);
      toast({
        title: "Removed from Favorites",
        description: `${accommodationName} has been removed from your favorites.`,
      });
      // Refresh the list
      fetchFavorites();
    } catch (err) {
      toast({
        title: "Error",
        description: `Could not remove ${accommodationName} from favorites. Please try again.`,
        variant: "destructive",
      });
    }
  };


  if (isLoading) {
    return (
      <>
        <h1 className="text-3xl font-bold flex items-center mb-6">
          <Icons.heart className="mr-3 h-8 w-8 text-destructive fill-destructive" />
          My Favorites
        </h1>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="shadow-lg">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-8 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading favorites: {error}</p>
        <Button onClick={fetchFavorites} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Icons.heart className="mr-3 h-8 w-8 text-destructive fill-destructive" />
          My Favorites
        </h1>
      </div>

      {favoriteAccommodations.length === 0 ? (
        <Card className="shadow-lg text-center">
          <CardHeader>
            <CardTitle>No Favorites Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You haven't favorited any accommodations. Start exploring and add some!
            </p>
            <Link href="/" passHref>
              <Button>
                <Icons.search className="mr-2 h-4 w-4" />
                Find Accommodations
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {favoriteAccommodations.map((accommodation) => (
            <Card key={accommodation.id} className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/accommodation/${accommodation.id}`} passHref className="block">
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
                </div>
              </Link>
              <CardHeader className="pb-2">
                <Link href={`/accommodation/${accommodation.id}`} passHref>
                  <CardTitle className="text-xl truncate hover:text-primary">{accommodation.name}</CardTitle>
                </Link>
                <Badge variant="secondary" className="w-fit">{accommodation.type}</Badge>
              </CardHeader>
              <CardContent className="flex-grow pb-2">
                 <Link href={`/accommodation/${accommodation.id}`} passHref>
                    <CardDescription className="line-clamp-3">{accommodation.description}</CardDescription>
                 </Link>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2">
                <p className="text-lg font-semibold">${accommodation.pricePerNight}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFromFavorites(accommodation.id, accommodation.name)}
                  aria-label="Remove from favorites"
                  className="text-destructive hover:text-destructive/80"
                >
                  <Icons.heart className="h-5 w-5 fill-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
