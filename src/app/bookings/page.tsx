
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/services/booking";
import { getBookingsByUserId } from "@/services/booking";
import { format } from "date-fns";
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/metadata'; // Adjust path as necessary

// export const metadata = generatePageMetadata({
//   title: 'My Bookings - StayZen',
//   description: 'View and manage your accommodation bookings.',
// });

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Using a placeholder user ID until authentication is implemented
        const data = await getBookingsByUserId("user_placeholder_id");
        setBookings(data);
      } catch (err: any) {
        setError(err.message || "Failed to load bookings.");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Icons.loader className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive py-10">
        <Icons.alertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="text-xl font-semibold">Error loading bookings</p>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <Icons.refreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
          <Icons.briefcase className="mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          My Bookings
        </h1>
      </div>

      {bookings.length === 0 ? (
        <Card className="shadow-lg text-center py-10">
          <CardHeader className="pt-0">
            <Icons.calendarX className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <CardTitle className="text-2xl">No Bookings Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You haven't made any bookings. Start exploring to find your next adventure!
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
        <div className="space-y-6">
          {bookings.map((booking) => {
            const hint = "hotel room"; // Or derive from booking.accommodationType if available
            const imageUrl = `https://source.unsplash.com/400x300/?${hint.split(' ').join(',')}`;
            return (
            <Card key={booking.id} className="shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
              <div className="md:flex">
                <div className="md:w-1/3 relative h-48 md:h-auto min-h-[150px] md:min-h-full">
                  <Image
                    src={imageUrl} // Use Unsplash URL
                    alt={booking.accommodationName}
                    layout="fill"
                    objectFit="cover"
                    className="md:rounded-l-lg md:rounded-tr-none rounded-t-lg"
                    data-ai-hint={hint}
                  />
                </div>
                <div className="md:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                      <div>
                        <Badge 
                          variant={booking.status === 'confirmed' ? 'default' : 'secondary'} 
                          className={`capitalize text-xs px-2 py-1 ${booking.status === 'confirmed' ? 'bg-green-500 text-white' : ''}`}
                        >
                          {booking.status}
                        </Badge>
                        <CardTitle className="text-xl sm:text-2xl mt-1 hover:text-primary transition-colors">
                           <Link href={`/accommodation/${booking.accommodationId}?checkIn=${format(new Date(booking.checkInDate), 'yyyy-MM-dd')}&checkOut=${format(new Date(booking.checkOutDate), 'yyyy-MM-dd')}&guests=${booking.numberOfGuests}`}>
                            {booking.accommodationName}
                           </Link>
                        </CardTitle>
                      </div>
                       <p className="text-lg sm:text-xl font-semibold text-primary whitespace-nowrap pt-1">
                        ${booking.totalPrice.toFixed(2)}
                      </p>
                    </div>
                     <CardDescription className="text-xs sm:text-sm mb-4">
                      Booked on: {format(new Date(booking.bookedAt), "PPP p")}
                    </CardDescription>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm mb-4">
                    <div>
                      <p className="font-medium flex items-center text-xs text-muted-foreground"><Icons.calendarDays className="mr-1.5 h-3.5 w-3.5"/>Check-in</p>
                      <p className="text-foreground">{format(new Date(booking.checkInDate), "EEE, MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="font-medium flex items-center text-xs text-muted-foreground"><Icons.calendarDays className="mr-1.5 h-3.5 w-3.5"/>Check-out</p>
                      <p className="text-foreground">{format(new Date(booking.checkOutDate), "EEE, MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="font-medium flex items-center text-xs text-muted-foreground"><Icons.users className="mr-1.5 h-3.5 w-3.5"/>Guests</p>
                      <p className="text-foreground">{booking.numberOfGuests}</p>
                    </div>
                     <div>
                      <p className="font-medium flex items-center text-xs text-muted-foreground"><Icons.file className="mr-1.5 h-3.5 w-3.5"/>Booking ID</p>
                      <p className="text-foreground truncate" title={booking.id}>{booking.id}</p>
                    </div>
                  </div>
                   <CardFooter className="p-0 pt-2 border-t border-border/50">
                      <Button variant="outline" size="sm" disabled className="mt-4 w-full sm:w-auto">Manage Booking (Soon)</Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          );
        })}
        </div>
      )}
    </>
  );
}
