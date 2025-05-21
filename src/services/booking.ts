
'use server';
import type { Accommodation } from './accommodation';
import { getAccommodationById } from './accommodation'; // To get accommodation details for booking summary

// Augment the global type to include our custom store for bookings
declare global {
  var bookings_data_store: Booking[] | undefined;
}

export interface Booking {
  id: string;
  accommodationId: string;
  accommodationName: string; // For easier display on booking list
  accommodationImage: string; // For easier display
  userId: string; // Placeholder for now
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedAt: Date;
}

interface CreateBookingInput {
  accommodationId: string;
  userId: string; // Placeholder
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
}

// Initialize bookings_data using the global object
// This helps persist the array across HMR updates in development
if (!globalThis.bookings_data_store) {
  console.log('[Booking Service] Initializing globalThis.bookings_data_store');
  globalThis.bookings_data_store = [];
}
const bookings_data: Booking[] = globalThis.bookings_data_store;

function calculateTotalPrice(pricePerNight: number, checkIn: Date, checkOut: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.max(1, Math.round(diffTime / oneDay)); // Ensure at least 1 day for calculation if dates are same or checkout is next day
  console.log(`[Booking Service] Calculating total price: ${pricePerNight} * ${diffDays} nights`);
  return diffDays * pricePerNight;
}

/**
 * Creates a new booking.
 */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  console.log('[Booking Service] Attempting to create booking with input:', input);
  const accommodation = await getAccommodationById(input.accommodationId);
  if (!accommodation) {
    console.error('[Booking Service] Accommodation not found for ID:', input.accommodationId);
    throw new Error('Accommodation not found.');
  }

  if (input.checkOutDate <= input.checkInDate) {
    console.error('[Booking Service] Invalid dates: Check-out date must be after check-in date.');
    throw new Error('Check-out date must be after check-in date.');
  }
  if (input.numberOfGuests <= 0) {
    console.error('[Booking Service] Invalid guests: Number of guests must be at least 1.');
    throw new Error('Number of guests must be at least 1.');
  }

  const newBooking: Booking = {
    id: Math.random().toString(36).substr(2, 9), // simple unique ID
    accommodationId: input.accommodationId,
    accommodationName: accommodation.name,
    accommodationImage: accommodation.imageUrls.length > 0 ? accommodation.imageUrls[0] : 'https://placehold.co/600x400.png',
    userId: input.userId,
    checkInDate: input.checkInDate,
    checkOutDate: input.checkOutDate,
    numberOfGuests: input.numberOfGuests,
    totalPrice: calculateTotalPrice(accommodation.pricePerNight, input.checkInDate, input.checkOutDate),
    status: 'confirmed',
    bookedAt: new Date(),
  };

  // bookings_data should be referencing globalThis.bookings_data_store
  bookings_data.push(newBooking);
  console.log('[Booking Service] Booking created. ID:', newBooking.id);
  console.log('[Booking Service] Total bookings after create (globalThis.bookings_data_store.length):', globalThis.bookings_data_store?.length);
  console.log('[Booking Service] Current globalThis.bookings_data_store (IDs):', globalThis.bookings_data_store?.map(b => b.id));
  return newBooking;
}

/**
 * Retrieves bookings for a given user ID.
 * For now, userId is a placeholder and it will return all bookings.
 */
export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  console.log(`[Booking Service] Fetching bookings for userId: ${userId}`);
  console.log('[Booking Service] Current globalThis.bookings_data_store length at getBookingsByUserId:', globalThis.bookings_data_store?.length);
  console.log('[Booking Service] Current globalThis.bookings_data_store IDs:', globalThis.bookings_data_store?.map(b => b.id));
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Directly use the global store, or the bookings_data reference to it.
      const currentBookings = globalThis.bookings_data_store || [];
      console.log('[Booking Service] globalThis.bookings_data_store length inside setTimeout:', currentBookings.length);
      console.log('[Booking Service] globalThis.bookings_data_store IDs inside setTimeout:', currentBookings.map(b => b.id));
      
      const sortedBookings = [...currentBookings].sort((a, b) => b.bookedAt.getTime() - a.bookedAt.getTime());
      resolve(sortedBookings);
    }, 300); // Simulate network delay
  });
}
