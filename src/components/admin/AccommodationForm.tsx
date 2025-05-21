
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Accommodation, CreateAccommodationInput, UpdateAccommodationInput } from "@/services/accommodation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Icons } from "@/components/icons";

const accommodationFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  lat: z.preprocess(
    (val) => Number(String(val)),
    z.number().min(-90).max(90, { message: "Latitude must be between -90 and 90." })
  ),
  lng: z.preprocess(
    (val) => Number(String(val)),
    z.number().min(-180).max(180, { message: "Longitude must be between -180 and 180." })
  ),
  pricePerNight: z.preprocess(
    (val) => Number(String(val)),
    z.number().positive({ message: "Price must be positive." })
  ),
  type: z.string().min(1, { message: "Type is required." }),
  imageUrls: z.string().min(1, { message: "At least one image URL is required." })
    .transform(value => value.split(',').map(url => url.trim()).filter(url => url.length > 0))
    .refine(urls => urls.every(url => z.string().url().safeParse(url).success), {
      message: "All image URLs must be valid URLs."
    }),
  amenities: z.string().min(1, { message: "At least one amenity is required."})
    .transform(value => value.split(',').map(amenity => amenity.trim()).filter(amenity => amenity.length > 0)),
});

export type AccommodationFormValues = z.infer<typeof accommodationFormSchema>;

interface AccommodationFormProps {
  onSubmit: (values: AccommodationFormValues) => Promise<void>;
  onCancel: () => void;
  initialData?: Accommodation | null;
  isSubmitting?: boolean;
}

export default function AccommodationForm({ onSubmit, onCancel, initialData, isSubmitting }: AccommodationFormProps) {
  const form = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      lat: initialData.location.lat,
      lng: initialData.location.lng,
      pricePerNight: initialData.pricePerNight,
      type: initialData.type,
      imageUrls: initialData.imageUrls.join(', '),
      amenities: initialData.amenities.join(', '),
    } : {
      name: "",
      description: "",
      lat: 0,
      lng: 0,
      pricePerNight: 100,
      type: "Apartment",
      imageUrls: "",
      amenities: "",
    },
  });

  const handleSubmit = async (values: AccommodationFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Accommodation" : "Add New Accommodation"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of this accommodation." : "Fill in the details for the new accommodation."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sunny Beachside Condo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the accommodation..." {...field} rows={4}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="e.g., 34.0522" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="e.g., -118.2437" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerNight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Per Night ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 150" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Apartment, Villa, Cabin" {...field} />
                </FormControl>
                <FormDescription>E.g., Apartment, Hotel, Villa, Cabin</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrls"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Image URLs</FormLabel>
                <FormControl>
                  <Textarea placeholder="https://example.com/image1.png, https://example.com/image2.png" {...field} />
                </FormControl>
                <FormDescription>Comma-separated list of image URLs.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Textarea placeholder="WiFi, Kitchen, Pool" {...field} />
                </FormControl>
                <FormDescription>Comma-separated list of amenities.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Icons.loader className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Accommodation"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
