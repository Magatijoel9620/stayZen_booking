
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Accommodation } from "@/services/accommodation";
import { getFavoriteAccommodations } from "@/services/favorites";
import { Button } from "./ui/button";

const MAX_FAVORITES_TO_SHOW = 3;

export default function FavoriteAccommodationsPreview() {
  const [favorites, setFavorites] = useState<Accommodation[]>([]);
  const [totalFavoritesCount, setTotalFavoritesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoritesData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getFavoriteAccommodations();
        setFavorites(data.slice(0, MAX_FAVORITES_TO_SHOW));
        setTotalFavoritesCount(data.length);
      } catch (err: any) {
        setError(err.message || "Failed to load favorite accommodations.");
        setFavorites([]);
        setTotalFavoritesCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavoritesData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(MAX_FAVORITES_TO_SHOW)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <Skeleton className="h-32 w-full rounded-t-lg" />
            <CardHeader className="p-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2 mt-1" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-destructive bg-destructive/10 rounded-lg">
        <Icons.alertTriangle className="mx-auto h-8 w-8 mb-2" />
        <p className="font-semibold">Error loading favorites</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border rounded-lg">
        <Icons.heart className="mx-auto h-8 w-8 mb-2 text-muted-foreground/70" />
        <p>Your favorite places will appear here.</p>
        <p className="text-xs">Start exploring and add some!</p>
         <Link href="/all-accommodations" passHref className="mt-3 inline-block">
            <Button variant="outline" size="sm">
                <Icons.search className="mr-2 h-3.5 w-3.5" />
                Find Stays
            </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((accommodation) => {
          const illustrationHint = accommodation.type === 'Apartment' ? "apartment illustration" : accommodation.type === 'Villa' ? "villa illustration" : "cabin illustration";
          return (
          <Link key={accommodation.id} href={`/accommodation/${accommodation.id}`} passHref>
            <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col cursor-pointer group">
              <div className="relative w-full h-32 sm:h-36">
                <Image
                  src={accommodation.imageUrls[0]}
                  alt={accommodation.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={illustrationHint}
                />
              </div>
              <CardHeader className="p-3 pb-1 flex-grow">
                <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                  {accommodation.name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs mt-1 w-fit px-1.5 py-0.5">{accommodation.type}</Badge>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <p className="text-sm font-medium text-primary">
                  ${accommodation.pricePerNight}
                  <span className="text-xs font-normal text-muted-foreground">/night</span>
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
      </div>
      {totalFavoritesCount > MAX_FAVORITES_TO_SHOW && (
        <div className="mt-6 text-center">
          <Link href="/favorites" passHref>
            <Button variant="outline">
              View All ({totalFavoritesCount}) Favorites
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
