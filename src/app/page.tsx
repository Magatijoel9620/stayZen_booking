
"use client";

import { AccommodationSearchCriteria } from "@/services/accommodation";
import AccommodationList from "@/components/AccommodationList";
import DateSelection from "@/components/DateSelection";
import FavoriteAccommodationsPreview from "@/components/FavoriteAccommodationsPreview";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
// import type { Metadata } from 'next';
// import { generatePageMetadata } from '@/metadata'; // Adjust path as necessary

// export const metadata = generatePageMetadata({
//   title: 'Home - StayZen',
//   description: 'Find and book your perfect stay. Search for hotels, villas, and apartments on StayZen.',
// });


export default function Home() {
  const [searchCriteria, setSearchCriteria] = useState<AccommodationSearchCriteria | null>(null);

  const handleSearch = (criteria: AccommodationSearchCriteria) => {
    setSearchCriteria(criteria);
  };

  return (
    <>
      <DateSelection onSearch={handleSearch} />

      {searchCriteria && (
         <section className="mt-10 mb-10">
          <div className="flex items-center mb-4">
            <Icons.search className="mr-3 h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">
              Search Results
            </h2>
          </div>
          <AccommodationList searchCriteria={searchCriteria} />
        </section>
      )}
      
      {!searchCriteria && (
        <section className="mt-10 mb-10">
          <div className="text-center py-10 text-muted-foreground">
            <Icons.calendarDays className="mx-auto h-12 w-12 mb-3 text-muted-foreground/70" />
            <p className="text-lg">Find your next getaway!</p>
            <p className="text-sm">Please select your dates and number of guests above to find accommodations.</p>
          </div>
        </section>
      )}
      
      <Separator className="my-8" />

      <section className="mt-10 mb-10">
        <div className="flex items-center mb-4">
          <Icons.heart className="mr-3 h-6 w-6 text-destructive" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Favorite Stays
          </h2>
        </div>
        <FavoriteAccommodationsPreview />
      </section>
    </>
  );
}
