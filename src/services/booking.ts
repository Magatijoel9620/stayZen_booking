
'use server';
import type { Accommodation } from './accommodation';
import { getAccommodationById } from './accommodation'; // To get accommodation details for booking summary

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

// In-memory store for bookings
const bookings_data: Booking[] = [];

function calculateTotalPrice(pricePerNight: number, checkIn: Date, checkOut: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay));
  return diffDays * pricePerNight;
}

/**
 * Creates a new booking.
 */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const accommodation = await getAccommodationById(input.accommodationId);
  if (!accommodation) {
    throw new Error('Accommodation not found.');
  }

  if (input.checkOutDate <= input.checkInDate) {
    throw new Error('Check-out date must be after check-in date.');
  }
  if (input.numberOfGuests <= 0) {
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

  bookings_data.push(newBooking);
  console.log('[Booking Service] Booking created. ID:', newBooking.id);
  console.log('[Booking Service] Total bookings after create:', bookings_data.length);
  // console.log('[Booking Service] All booking IDs after create:', bookings_data.map(b => b.id));
  return newBooking;
}

/**
 * Retrieves bookings for a given user ID.
 * For now, userId is a placeholder and it will return all bookings.
 */
export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  console.log(`[Booking Service] Fetching bookings for userId: ${userId}`);
  console.log('[Booking Service] Current total bookings at getBookingsByUserId:', bookings_data.length);
  // console.log('[Booking Service] All booking IDs at getBookingsByUserId:', bookings_data.map(b => b.id));
  
  // Create a new array from bookings_data to ensure it's the latest snapshot before timeout
  const currentBookingsSnapshot = [...bookings_data];

  return new Promise((resolve) => {
    setTimeout(() => {
      // Sort the snapshot taken before the timeout
      const sortedBookings = currentBookingsSnapshot.sort((a, b) => b.bookedAt.getTime() - a.bookedAt.getTime());
      resolve(sortedBookings);
    }, 300); // Simulate network delay
  });
}

