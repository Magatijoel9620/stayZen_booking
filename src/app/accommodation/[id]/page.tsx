
"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, notFound, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getAccommodationById, Accommodation } from "@/services/accommodation";
import { createBooking } from "@/services/booking";
import { addToFavorites, removeFromFavorites, isFavorite as checkIsFavorite } from "@/services/favorites";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { parseISO, isValid } from "date-fns";

function AccommodationDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();

  const [accommodation, setAccommodation] = useState<Accommodation | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState<boolean>(true);


  // Booking details from query params
  const checkInQuery = searchParams.get("checkIn");
  const checkOutQuery = searchParams.get("checkOut");
  const guestsQuery = searchParams.get("guests");

  const checkInDate = checkInQuery && isValid(parseISO(checkInQuery)) ? parseISO(checkInQuery) : undefined;
  const checkOutDate = checkOutQuery && isValid(parseISO(checkOutQuery)) ? parseISO(checkOutQuery) : undefined;
  const numberOfGuests = guestsQuery ? parseInt(guestsQuery, 10) : undefined;


  useEffect(() => {
    if (id) {
      const fetchAccommodationData = async () => {
        setIsLoading(true);
        setIsFavoriteLoading(true);
        try {
          const data = await getAccommodationById(id);
          setAccommodation(data);
          if (data) {
            const favoriteStatus = await checkIsFavorite(data.id);
            setIsFavorited(favoriteStatus);
          }
        } catch (error) {
          console.error("Failed to fetch accommodation:", error);
          setAccommodation(null);
        } finally {
          setIsLoading(false);
          setIsFavoriteLoading(false);
        }
      };
      fetchAccommodationData();
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!accommodation) return;
    setIsFavoriteLoading(true);
    try {
      if (isFavorited) {
        await removeFromFavorites(accommodation.id);
        toast({ title: "Removed from Favorites", description: `${accommodation.name} has been removed from your favorites.` });
      } else {
        await addToFavorites(accommodation.id);
        toast({ title: "Added to Favorites!", description: `${accommodation.name} has been added to your favorites.` });
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      toast({ title: "Error", description: "Could not update favorites. Please try again.", variant: "destructive" });
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!accommodation || !checkInDate || !checkOutDate || !numberOfGuests) {
      toast({
        title: "Booking Error",
        description: "Missing booking details. Please ensure dates and guest count are selected.",
        variant: "destructive",
      });
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast({
        title: "Booking Error",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      });
      return;
    }
    
    setIsBooking(true);
    try {
      await createBooking({
        accommodationId: accommodation.id,
        userId: "user_placeholder_id", // Replace with actual user ID when auth is implemented
        checkInDate,
        checkOutDate,
        numberOfGuests,
      });
      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${accommodation.name} has been confirmed.`,
        variant: "default",
      });
      router.push("/bookings");
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Could not complete your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

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
    notFound();
  }
  
  if (!accommodation) {
    return <div className="container mx-auto p-4 text-center">Something went wrong. Accommodation not found.</div>;
  }

  const canBook = checkInDate && checkOutDate && numberOfGuests && numberOfGuests > 0;

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
                priority
                data-ai-hint={accommodation.type === 'Apartment' ? "apartment room" : accommodation.type === 'Villa' ? "villa interior" : "cabin interior"}
              />
            )}
          </div>
        </CardHeader>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start mb-4">
            <div className="flex-grow">
              <Badge variant="secondary" className="mb-2">{accommodation.type}</Badge>
              <CardTitle className="text-3xl font-bold">{accommodation.name}</CardTitle>
            </div>
            <div className="flex items-center mt-2 md:mt-0 space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                disabled={isFavoriteLoading}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                className="text-destructive hover:text-destructive/80"
              >
                {isFavoriteLoading ? (
                  <Icons.loader className="h-6 w-6 animate-spin" />
                ) : (
                  <Icons.heart className={`h-6 w-6 ${isFavorited ? "fill-destructive" : ""}`} />
                )}
              </Button>
              <div className="flex items-center">
                <Icons.star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-lg font-semibold">{accommodation.rating}</span>
                <span className="text-sm text-muted-foreground ml-1">({accommodation.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>
          
          <CardDescription className="text-base mb-6">{accommodation.description}</CardDescription>
          
          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center"><Icons.bedDouble className="mr-2 h-5 w-5 text-primary"/>Details</h3>
              <p className="text-muted-foreground"><Icons.mapPin className="inline mr-2 h-4 w-4"/> Location: {accommodation.location.lat.toFixed(4)}, {accommodation.location.lng.toFixed(4)} (Placeholder)</p>
              {checkInDate && checkOutDate && (
                <p className="text-muted-foreground mt-1">
                  <Icons.calendarDays className="inline mr-2 h-4 w-4" />
                  Selected: {checkInDate.toLocaleDateString()} - {checkOutDate.toLocaleDateString()}
                </p>
              )}
              {numberOfGuests && (
                 <p className="text-muted-foreground mt-1">
                  <Icons.users className="inline mr-2 h-4 w-4" />
                  Guests: {numberOfGuests}
                </p>
              )}
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
            <Button 
              size="lg" 
              className="w-full md:w-auto bg-cta hover:bg-cta/90 text-primary-foreground"
              onClick={handleBookNow}
              disabled={!canBook || isBooking}
            >
              {isBooking ? <Icons.loader className="mr-2 h-5 w-5 animate-spin" /> : <Icons.calendarDays className="mr-2 h-5 w-5" />}
              {isBooking ? "Processing..." : "Book Now"}
            </Button>
          </CardFooter>
          {!canBook && (
            <p className="text-sm text-muted-foreground mt-2 text-center md:text-right">
              Please select dates and guest count on the home page to enable booking.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function AccommodationDetailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-4 text-center">Loading booking details...</div>}>
      <AccommodationDetailContent />
    </Suspense>
  );
}
