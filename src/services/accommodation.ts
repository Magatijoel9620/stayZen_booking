
/**
 * Represents a geographical location.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents information about an accommodation.
 */
export interface Accommodation {
  /**
   * The unique identifier for the accommodation.
   */
  id: string;
  /**
   * The name of the accommodation.
   */
  name: string;
  /**
   * A description of the accommodation.
   */
  description: string;
  /**
   * The location of the accommodation.
   */
  location: Location;
  /**
   * The price per night for the accommodation.
   */
  pricePerNight: number;
  /**
   * Image URLs of the accommodations
   */
  imageUrls: string[];
  /**
   * Type of accommodation, e.g., 'Apartment', 'Hotel', 'Villa'.
   */
  type: string;
  /**
   * Star rating of the accommodation.
   */
  rating: number;
  /**
   * Number of reviews.
   */
  reviewsCount: number;
  /**
   * List of amenities.
   */
  amenities: string[];
}

/**
 * Represents search criteria for finding accommodations.
 */
export interface AccommodationSearchCriteria {
  /**
   * The location to search for accommodations.
   */
  location: Location;
  /**
   * The check-in date.
   */
  checkInDate: Date;
  /**
   * The check-out date.
   */
  checkOutDate: Date;
  /**
   * The number of guests.
   */
  numberOfGuests: number;
}

// Use globalThis for in-memory store to persist across HMR in development
declare global {
  var accommodations_data_store: Accommodation[] | undefined;
}

if (!globalThis.accommodations_data_store) {
  console.log('[Accommodation Service] Initializing globalThis.accommodations_data_store');
  globalThis.accommodations_data_store = [
    {
      id: '1',
      name: 'Cozy Downtown Apartment',
      description: 'A charming and centrally located apartment, perfect for city explorers. Features a fully equipped kitchen and a comfortable living space.',
      location: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
      pricePerNight: 150,
      imageUrls: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png?a=2'],
      type: 'Apartment',
      rating: 4.5,
      reviewsCount: 120,
      amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'TV', 'Free Parking'],
    },
    {
      id: '2',
      name: 'Luxury Beachfront Villa',
      description: 'Experience luxury with stunning ocean views. This villa offers a private pool, direct beach access, and spacious rooms.',
      location: { lat: 33.9934, lng: -118.4792 }, // Santa Monica
      pricePerNight: 450,
      imageUrls: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png?b=2'],
      type: 'Villa',
      rating: 4.9,
      reviewsCount: 250,
      amenities: ['WiFi', 'Pool', 'Beach Access', 'Parking', 'Gym'],
    },
    {
      id: '3',
      name: 'Rustic Mountain Cabin',
      description: 'Escape to this peaceful cabin in the mountains. Ideal for hiking, relaxing, and enjoying nature. Features a cozy fireplace.',
      location: { lat: 34.2014, lng: -117.0718 }, // Big Bear Lake
      pricePerNight: 200,
      imageUrls: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png?c=2'],
      type: 'Cabin',
      rating: 4.7,
      reviewsCount: 90,
      amenities: ['WiFi', 'Fireplace', 'Hiking Trails', 'Pet-friendly', 'BBQ Grill'],
    },
  ];
}
const accommodations_data = globalThis.accommodations_data_store;


export type CreateAccommodationInput = Omit<Accommodation, 'id' | 'rating' | 'reviewsCount'>;

export async function createAccommodation(data: CreateAccommodationInput): Promise<Accommodation> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAccommodation: Accommodation = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)), // Random rating between 3.0 and 5.0
        reviewsCount: Math.floor(Math.random() * 200) + 10, // Random reviews count
      };
      accommodations_data.push(newAccommodation);
      resolve(newAccommodation);
    }, 300);
  });
}

export type UpdateAccommodationInput = Partial<Omit<Accommodation, 'id' | 'rating' | 'reviewsCount'>>;

export async function updateAccommodation(id: string, data: UpdateAccommodationInput): Promise<Accommodation | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = accommodations_data.findIndex(acc => acc.id === id);
      if (index !== -1) {
        accommodations_data[index] = { ...accommodations_data[index], ...data };
        resolve(accommodations_data[index]);
      } else {
        resolve(undefined);
      }
    }, 300);
  });
}

export async function deleteAccommodation(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = accommodations_data.length;
      globalThis.accommodations_data_store = accommodations_data.filter(acc => acc.id !== id);
      if (globalThis.accommodations_data_store.length < initialLength) {
        resolve();
      } else {
        reject(new Error("Accommodation not found for deletion."));
      }
    }, 300);
  });
}


/**
 * Asynchronously retrieves available accommodations based on the provided search criteria.
 *
 * @param searchCriteria The criteria to use when searching for accommodations.
 * @returns A promise that resolves to an array of Accommodation objects.
 */
export async function getAvailableAccommodations(
  searchCriteria: AccommodationSearchCriteria
): Promise<Accommodation[]> {
  // Simulate filtering based on criteria (e.g., number of guests, dates)
  console.log("Searching with criteria:", searchCriteria);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic filtering example (can be expanded)
      const filtered = accommodations_data.filter(acc => {
        // Add more complex filtering logic here if needed, e.g., date availability
        return true; // For now, return all that match guest count (if it were implemented)
      });
      resolve(filtered);
    }, 500); // Simulate network delay
  });
}

/**
 * Asynchronously retrieves a specific accommodation by its ID.
 *
 * @param id The ID of the accommodation to retrieve.
 * @returns A promise that resolves to an Accommodation object if found, or undefined.
 */
export async function getAccommodationById(id: string): Promise<Accommodation | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accommodation = accommodations_data.find(acc => acc.id === id);
      resolve(accommodation);
    }, 300); // Simulate network delay
  });
}

/**
 * Asynchronously retrieves all accommodations.
 * @returns A promise that resolves to an array of all Accommodation objects.
 */
export async function getAllAccommodations(): Promise<Accommodation[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...accommodations_data]);
    }, 200); // Simulate network delay
  });
}
