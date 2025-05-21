
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Booking } from "@/services/booking";
import { getBookingsByUserId } from "@/services/booking";
import { format } from "date-fns";

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
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center py-10">
          <Icons.loader className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-destructive">
        <p>Error loading bookings: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Icons.briefcase className="mr-3 h-8 w-8 text-primary" />
          My Bookings
        </h1>
      </div>

      {bookings.length === 0 ? (
        <Card className="shadow-lg text-center">
          <CardHeader>
            <CardTitle>No Bookings Yet</CardTitle>
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
          {bookings.map((booking) => (
            <Card key={booking.id} className="shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 relative h-48 md:h-auto">
                  <Image
                    src={booking.accommodationImage || 'https://placehold.co/400x300.png'}
                    alt={booking.accommodationName}
                    layout="fill"
                    objectFit="cover"
                    className="md:rounded-l-lg md:rounded-tr-none rounded-t-lg"
                    data-ai-hint="hotel room"
                  />
                </div>
                <div className="md:w-2/3">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="mb-1 capitalize bg-green-500 text-white">
                          {booking.status}
                        </Badge>
                        <CardTitle className="text-2xl hover:text-primary">
                           <Link href={`/accommodation/${booking.accommodationId}`}>
                            {booking.accommodationName}
                           </Link>
                        </CardTitle>
                      </div>
                       <p className="text-lg font-semibold text-primary whitespace-nowrap">
                        ${booking.totalPrice.toFixed(2)}
                      </p>
                    </div>
                     <CardDescription>
                      Booked on: {format(new Date(booking.bookedAt), "PPP p")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium flex items-center"><Icons.calendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>Check-in</p>
                        <p className="text-muted-foreground">{format(new Date(booking.checkInDate), "EEE, MMM d, yyyy")}</p>
                      </div>
                      <div>
                        <p className="font-medium flex items-center"><Icons.calendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>Check-out</p>
                        <p className="text-muted-foreground">{format(new Date(booking.checkOutDate), "EEE, MMM d, yyyy")}</p>
                      </div>
                      <div>
                        <p className="font-medium flex items-center"><Icons.users className="mr-2 h-4 w-4 text-muted-foreground"/>Guests</p>
                        <p className="text-muted-foreground">{booking.numberOfGuests}</p>
                      </div>
                       <div>
                        <p className="font-medium flex items-center"><Icons.file className="mr-2 h-4 w-4 text-muted-foreground"/>Booking ID</p>
                        <p className="text-muted-foreground truncate">{booking.id}</p>
                      </div>
                    </div>
                  </CardContent>
                   <CardFooter>
                     {/* Add actions like "Cancel Booking" or "View Details" if needed later */}
                      <Button variant="outline" size="sm" disabled>Manage Booking (Soon)</Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

