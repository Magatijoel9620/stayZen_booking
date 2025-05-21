
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
  return new Promise(async (resolve, reject) => {
    const accommodation = await getAccommodationById(input.accommodationId);
    if (!accommodation) {
      return reject(new Error('Accommodation not found.'));
    }

    if (input.checkOutDate <= input.checkInDate) {
      return reject(new Error('Check-out date must be after check-in date.'));
    }
    if (input.numberOfGuests <= 0) {
      return reject(new Error('Number of guests must be at least 1.'));
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
    console.log('Booking created:', newBooking);
    console.log('All bookings:', bookings_data);
    resolve(newBooking);
  });
}

/**
 * Retrieves bookings for a given user ID.
 * For now, userId is a placeholder and it will return all bookings.
 */
export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  console.log(`Fetching bookings for userId: ${userId} (currently returning all)`);
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you'd filter by userId
      resolve([...bookings_data].sort((a, b) => b.bookedAt.getTime() - a.bookedAt.getTime()));
    }, 300);
  });
}
