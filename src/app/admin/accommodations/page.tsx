
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Accommodation } from "@/services/accommodation";
import { getAllAccommodations, createAccommodation, updateAccommodation, deleteAccommodation } from "@/services/accommodation";
import AccommodationForm, { type AccommodationFormValues } from "@/components/admin/AccommodationForm";
import { useToast } from "@/hooks/use-toast";

export default function AdminAccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAccommodationId, setDeletingAccommodationId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchAccommodations = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  const handleOpenAddForm = () => {
    setEditingAccommodation(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setDeletingAccommodationId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleFormSubmit = async (values: AccommodationFormValues) => {
    setIsSubmitting(true);
    try {
      const accommodationData = {
        name: values.name,
        description: values.description,
        location: { lat: values.lat, lng: values.lng },
        pricePerNight: values.pricePerNight,
        type: values.type,
        imageUrls: values.imageUrls,
        amenities: values.amenities,
      };

      if (editingAccommodation) {
        await updateAccommodation(editingAccommodation.id, accommodationData);
        toast({ title: "Success", description: "Accommodation updated successfully." });
      } else {
        await createAccommodation(accommodationData);
        toast({ title: "Success", description: "Accommodation created successfully." });
      }
      setIsFormOpen(false);
      setEditingAccommodation(null);
      fetchAccommodations(); // Refresh list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save accommodation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAccommodationId) return;
    setIsSubmitting(true);
    try {
      await deleteAccommodation(deletingAccommodationId);
      toast({ title: "Success", description: "Accommodation deleted successfully." });
      fetchAccommodations(); // Refresh list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete accommodation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setDeletingAccommodationId(null);
    }
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
        <Button onClick={handleOpenAddForm}>
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
                    <TableCell className="text-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditForm(acc)}
                      >
                        <Icons.edit className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(acc.id)}
                      >
                        <Icons.trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(open) => {
        if (!open) {
          setIsFormOpen(false);
          setEditingAccommodation(null);
        } else {
          setIsFormOpen(true);
        }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <AccommodationForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingAccommodation(null);
            }}
            initialData={editingAccommodation}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the accommodation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingAccommodationId(null)} disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90">
              {isSubmitting && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
