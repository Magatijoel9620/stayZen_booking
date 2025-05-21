
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { getAccommodationById, Accommodation } from "@/services/accommodation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccommodationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [accommodation, setAccommodation] = useState<Accommodation | null | undefined>(undefined); // undefined for loading, null for not found
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchAccommodation = async () => {
        setIsLoading(true);
        try {
          const data = await getAccommodationById(id);
          setAccommodation(data);
        } catch (error) {
          console.error("Failed to fetch accommodation:", error);
          setAccommodation(null); // Treat error as not found for simplicity
        } finally {
          setIsLoading(false);
        }
      };
      fetchAccommodation();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4 mt-2" />
          </CardHeader>
          <div className="relative w-full h-96">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
          <CardContent className="mt-4 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Separator />
            <Skeleton className="h-6 w-1/3" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-10 w-1/3 ml-auto" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (accommodation === null) {
    notFound(); // This will render the nearest not-found.js file or a default Next.js 404 page
  }
  
  if (!accommodation) { // Handles case where accommodation might still be undefined after loading if id was bad early
    return <div className="container mx-auto p-4 text-center">Something went wrong. Accommodation not found.</div>;
  }


  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative w-full h-72 md:h-96">
            {accommodation.imageUrls.length > 0 && (
              <Image
                src={accommodation.imageUrls[0]}
                alt={accommodation.name}
                layout="fill"
                objectFit="cover"
                priority // Prioritize loading the main image
                data-ai-hint={accommodation.type === 'Apartment' ? "apartment room" : accommodation.type === 'Villa' ? "villa interior" : "cabin interior"}
              />
            )}
          </div>
        </CardHeader>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
            <div>
              <Badge variant="secondary" className="mb-2">{accommodation.type}</Badge>
              <CardTitle className="text-3xl font-bold">{accommodation.name}</CardTitle>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <Icons.star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-lg font-semibold">{accommodation.rating}</span>
              <span className="text-sm text-muted-foreground ml-1">({accommodation.reviewsCount} reviews)</span>
            </div>
          </div>
          
          <CardDescription className="text-base mb-6">{accommodation.description}</CardDescription>
          
          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center"><Icons.bedDouble className="mr-2 h-5 w-5 text-primary"/>Details</h3>
              <p className="text-muted-foreground"><Icons.mapPin className="inline mr-2 h-4 w-4"/> Location: {accommodation.location.lat.toFixed(4)}, {accommodation.location.lng.toFixed(4)} (Placeholder)</p>
              {/* Add more details like capacity, beds, baths if available in data */}
            </div>
             <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center"><Icons.check className="mr-2 h-5 w-5 text-primary"/>Amenities</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                {accommodation.amenities.slice(0, 6).map(amenity => (
                  <li key={amenity} className="flex items-center">
                    <Icons.check className="h-4 w-4 mr-2 text-green-500" /> {amenity}
                  </li>
                ))}
              </ul>
               {accommodation.amenities.length > 6 && <p className="text-sm text-muted-foreground mt-1">+ {accommodation.amenities.length -6} more</p>}
            </div>
          </div>

          <Separator className="my-6" />

          <CardFooter className="p-0 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-3xl font-bold text-primary">
              ${accommodation.pricePerNight}
              <span className="text-base font-normal text-muted-foreground">/night</span>
            </p>
            <Button size="lg" className="w-full md:w-auto bg-cta hover:bg-cta/90 text-primary-foreground">
              <Icons.calendarDays className="mr-2 h-5 w-5" />
              Book Now
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
