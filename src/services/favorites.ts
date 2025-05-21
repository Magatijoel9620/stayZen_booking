
'use server';

/**
 * @fileOverview Service for managing user's favorite accommodations.
 * Favorites are stored in-memory for this example.
 */

import type { Accommodation } from './accommodation';
import { getAccommodationById } from './accommodation';

// In-memory store for favorite accommodation IDs, keyed by userId
// For now, we'll use a single placeholder user.
const userFavorites: { [userId: string]: string[] } = {
  'user_placeholder_id': [],
};

const PLACEHOLDER_USER_ID = 'user_placeholder_id';

/**
 * Adds an accommodation to the user's favorites.
 * @param accommodationId The ID of the accommodation to add.
 * @param userId The ID of the user (placeholder for now).
 * @returns A promise that resolves when the operation is complete.
 */
export async function addToFavorites(accommodationId: string): Promise<void> {
  return new Promise((resolve) => {
    if (!userFavorites[PLACEHOLDER_USER_ID]) {
      userFavorites[PLACEHOLDER_USER_ID] = [];
    }
    if (!userFavorites[PLACEHOLDER_USER_ID].includes(accommodationId)) {
      userFavorites[PLACEHOLDER_USER_ID].push(accommodationId);
    }
    console.log(`Favorites for ${PLACEHOLDER_USER_ID}:`, userFavorites[PLACEHOLDER_USER_ID]);
    resolve();
  });
}

/**
 * Removes an accommodation from the user's favorites.
 * @param accommodationId The ID of the accommodation to remove.
 * @param userId The ID of the user (placeholder for now).
 * @returns A promise that resolves when the operation is complete.
 */
export async function removeFromFavorites(accommodationId: string): Promise<void> {
  return new Promise((resolve) => {
    if (userFavorites[PLACEHOLDER_USER_ID]) {
      userFavorites[PLACEHOLDER_USER_ID] = userFavorites[PLACEHOLDER_USER_ID].filter(id => id !== accommodationId);
    }
    console.log(`Favorites for ${PLACEHOLDER_USER_ID}:`, userFavorites[PLACEHOLDER_USER_ID]);
    resolve();
  });
}

/**
 * Checks if an accommodation is in the user's favorites.
 * @param accommodationId The ID of the accommodation to check.
 * @param userId The ID of the user (placeholder for now).
 * @returns A promise that resolves to true if the accommodation is a favorite, false otherwise.
 */
export async function isFavorite(accommodationId: string): Promise<boolean> {
  return new Promise((resolve) => {
    const isFav = userFavorites[PLACEHOLDER_USER_ID]?.includes(accommodationId) || false;
    resolve(isFav);
  });
}

/**
 * Retrieves the list of favorite accommodation IDs for a user.
 * @param userId The ID of the user (placeholder for now).
 * @returns A promise that resolves to an array of favorite accommodation IDs.
 */
export async function getFavoriteAccommodationIds(): Promise<string[]> {
  return new Promise((resolve) => {
    resolve([...(userFavorites[PLACEHOLDER_USER_ID] || [])]);
  });
}

/**
 * Retrieves the full Accommodation objects for a user's favorites.
 * @param userId The ID of the user (placeholder for now).
 * @returns A promise that resolves to an array of favorite Accommodation objects.
 */
export async function getFavoriteAccommodations(): Promise<Accommodation[]> {
   return new Promise(async (resolve) => {
    const favoriteIds = await getFavoriteAccommodationIds();
    const favoriteAccommodations: Accommodation[] = [];
    for (const id of favoriteIds) {
      const accommodation = await getAccommodationById(id);
      if (accommodation) {
        favoriteAccommodations.push(accommodation);
      }
    }
    resolve(favoriteAccommodations);
  });
}
