
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
import type { Accommodation } from "@/services/accommodation";
import { getAllAccommodations } from "@/services/accommodation";
import { useToast } from "@/hooks/use-toast";

export default function AdminAccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccommodations = async () => {
      setIsLoading(true);
      try {
        const data = await getAllAccommodations();
        setAccommodations(data);
      } catch (error) {
        console.error("Failed to fetch accommodations:", error);
        toast({
          title: "Error",
          description: "Could not load accommodations.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccommodations();
  }, [toast]);

  const handleEdit = (id: string) => {
    toast({ title: "Edit Clicked", description: `Edit action for accommodation ID: ${id} (Not implemented)`});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Icons.loader className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading accommodations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div className="flex items-center">
            <Icons.hotel className="mr-2 h-6 w-6" />
            <h1 className="text-2xl font-semibold">Manage Accommodations</h1>
        </div>
        <Button onClick={() => toast({ title: "Add New", description: "Add new accommodation (Not implemented)"})}>
            <Icons.plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Accommodations</CardTitle>
          <CardDescription>View and manage all property listings.</CardDescription>
        </CardHeader>
        <CardContent>
          {accommodations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No accommodations found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Price/Night</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accommodations.map((acc) => (
                  <TableRow key={acc.id}>
                    <TableCell className="font-medium">{acc.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{acc.type}</Badge>
                    </TableCell>
                    <TableCell>{`${acc.location.lat.toFixed(2)}, ${acc.location.lng.toFixed(2)}`}</TableCell>
                    <TableCell className="text-right">${acc.pricePerNight.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{acc.rating.toFixed(1)}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(acc.id)}
                      >
                        <Icons.edit className="mr-1 h-3.5 w-3.5" />
                        Edit
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
