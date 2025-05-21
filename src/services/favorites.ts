
'use server';

/**
 * @fileOverview Service for managing user's favorite accommodations.
 * Favorites are stored in-memory for this example.
 */

import type { Accommodation } from './accommodation';
import { getAccommodationById } from './accommodation';

// Augment the global type to include our custom store for favorites
declare global {
  var user_favorites_store: { [userId: string]: string[] } | undefined;
}

// Initialize userFavorites using the global object
// This helps persist the array across HMR updates in development
if (!globalThis.user_favorites_store) {
  console.log('[Favorites Service] Initializing globalThis.user_favorites_store');
  globalThis.user_favorites_store = {
    'user_placeholder_id': [],
  };
}
const userFavorites: { [userId: string]: string[] } = globalThis.user_favorites_store;


const PLACEHOLDER_USER_ID = 'user_placeholder_id';

/**
 * Adds an accommodation to the user's favorites.
 * @param accommodationId The ID of the accommodation to add.
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
    console.log(`[Favorites Service] Favorites for ${PLACEHOLDER_USER_ID} after add:`, userFavorites[PLACEHOLDER_USER_ID]);
    console.log(`[Favorites Service] globalThis.user_favorites_store:`, globalThis.user_favorites_store);
    resolve();
  });
}

/**
 * Removes an accommodation from the user's favorites.
 * @param accommodationId The ID of the accommodation to remove.
 * @returns A promise that resolves when the operation is complete.
 */
export async function removeFromFavorites(accommodationId: string): Promise<void> {
  return new Promise((resolve) => {
    if (userFavorites[PLACEHOLDER_USER_ID]) {
      userFavorites[PLACEHOLDER_USER_ID] = userFavorites[PLACEHOLDER_USER_ID].filter(id => id !== accommodationId);
    }
    console.log(`[Favorites Service] Favorites for ${PLACEHOLDER_USER_ID} after remove:`, userFavorites[PLACEHOLDER_USER_ID]);
    console.log(`[Favorites Service] globalThis.user_favorites_store:`, globalThis.user_favorites_store);
    resolve();
  });
}

/**
 * Checks if an accommodation is in the user's favorites.
 * @param accommodationId The ID of the accommodation to check.
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
 * @returns A promise that resolves to an array of favorite accommodation IDs.
 */
export async function getFavoriteAccommodationIds(): Promise<string[]> {
  return new Promise((resolve) => {
    console.log(`[Favorites Service] Getting favorite IDs for ${PLACEHOLDER_USER_ID}:`, userFavorites[PLACEHOLDER_USER_ID] || []);
    console.log(`[Favorites Service] globalThis.user_favorites_store for user:`, globalThis.user_favorites_store?.[PLACEHOLDER_USER_ID]);
    resolve([...(userFavorites[PLACEHOLDER_USER_ID] || [])]);
  });
}

/**
 * Retrieves the full Accommodation objects for a user's favorites.
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
    console.log(`[Favorites Service] Resolved favorite accommodations:`, favoriteAccommodations.length);
    resolve(favoriteAccommodations);
  });
}
