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

/**
 * Asynchronously retrieves available accommodations based on the provided search criteria.
 *
 * @param searchCriteria The criteria to use when searching for accommodations.
 * @returns A promise that resolves to an array of Accommodation objects.
 */
export async function getAvailableAccommodations(
  searchCriteria: AccommodationSearchCriteria
): Promise<Accommodation[]> {
  // TODO: Implement this by calling an external API.

  const stubbedLocation: Location = { lat: 34.0522, lng: -118.2437 };

  return [
    {
      id: '1',
      name: 'Cozy Apartment',
      description: 'A cozy apartment in downtown.',
      location: stubbedLocation,
      pricePerNight: 120,
      imageUrls: ['https://example.com/apartment1.jpg', 'https://example.com/apartment2.jpg'],
    },
    {
      id: '2',
      name: 'Luxury Hotel Room',
      description: 'A luxurious hotel room with a view.',
      location: stubbedLocation,
      pricePerNight: 300,
      imageUrls: ['https://example.com/hotel1.jpg', 'https://example.com/hotel2.jpg'],
    },
  ];
}
