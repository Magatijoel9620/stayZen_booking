
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/services/booking";
import { getBookingsByUserId } from "@/services/booking"; // Using this for now, ideally admin gets all
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // For a real admin panel, you'd have a service function like `getAllBookings()`
        // For now, we'll use the existing one with a placeholder ID, assuming it fetches all for demo
        const data = await getBookingsByUserId("admin_user_id_placeholder"); 
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast({
          title: "Error",
          description: "Could not load bookings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [toast]);

  const handleApprove = (id: string) => {
     toast({ title: "Approve Clicked", description: `Approve booking ID: ${id} (Not implemented)`});
  };
  
  const handleCancel = (id: string) => {
     toast({ title: "Cancel Clicked", description: `Cancel booking ID: ${id} (Not implemented)`});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Icons.loader className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Icons.briefcase className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-semibold">Manage Bookings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>View and manage all customer bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
             <p className="text-muted-foreground text-center py-4">No bookings found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Accommodation</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead className="text-right">Guests</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">{booking.id}</TableCell>
                    <TableCell className="font-medium">{booking.accommodationName}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{format(new Date(booking.checkInDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(booking.checkOutDate), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">{booking.numberOfGuests}</TableCell>
                    <TableCell className="text-right">${booking.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}
                        className={`capitalize ${booking.status === 'confirmed' ? 'bg-green-500 text-white' : ''}`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center space-x-1">
                      {booking.status !== 'confirmed' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(booking.id)}
                            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                            <Icons.check className="mr-1 h-3.5 w-3.5" /> Approve
                        </Button>
                      )}
                       <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Icons.close className="mr-1 h-3.5 w-3.5" /> Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
