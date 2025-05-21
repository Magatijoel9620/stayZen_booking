
"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { getBookingsByUserId, updateBookingStatus } from "@/services/booking";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
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
  }, [toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleUpdateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    setUpdatingBookingId(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast({
        title: "Success",
        description: `Booking ${newStatus === 'confirmed' ? 'approved' : 'cancelled'} successfully.`,
      });
      fetchBookings(); // Refresh list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${newStatus === 'confirmed' ? 'approve' : 'cancel'} booking.`,
        variant: "destructive",
      });
    } finally {
      setUpdatingBookingId(null);
    }
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
                    <TableCell className="font-mono text-xs">{booking.id.substring(0,7)}...</TableCell>
                    <TableCell className="font-medium">{booking.accommodationName}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{format(new Date(booking.checkInDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(booking.checkOutDate), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">{booking.numberOfGuests}</TableCell>
                    <TableCell className="text-right">${booking.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}
                        className={`capitalize ${booking.status === 'confirmed' ? 'bg-green-500 text-white' : booking.status === 'pending' ? 'bg-yellow-400 text-black' : ''}`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center space-x-1">
                      {booking.status === 'pending' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                            disabled={updatingBookingId === booking.id}
                            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                            {updatingBookingId === booking.id ? <Icons.loader className="mr-1 h-3.5 w-3.5 animate-spin"/> : <Icons.check className="mr-1 h-3.5 w-3.5" />} 
                            Approve
                        </Button>
                      )}
                       {booking.status !== 'cancelled' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            disabled={updatingBookingId === booking.id}
                            className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            {updatingBookingId === booking.id ? <Icons.loader className="mr-1 h-3.5 w-3.5 animate-spin"/> : <Icons.close className="mr-1 h-3.5 w-3.5" />} 
                            Cancel
                        </Button>
                       )}
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
