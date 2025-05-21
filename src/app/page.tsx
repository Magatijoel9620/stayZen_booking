
"use client";

import { AccommodationSearchCriteria } from "@/services/accommodation";
import AccommodationList from "@/components/AccommodationList";
import BottomSheetMenu from "@/components/BottomSheetMenu";
import DateSelection from "@/components/DateSelection";
import { useState } from "react";

export default function Home() {
  const [searchCriteria, setSearchCriteria] = useState<AccommodationSearchCriteria | null>(null);

  const handleSearch = (criteria: AccommodationSearchCriteria) => {
    setSearchCriteria(criteria);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-primary">StayFinder</h1>
          {/* You can add more header elements here, like a logo or user icon */}
        </div>
      </header>
      <main className="flex-1 p-4 container mx-auto">
        <DateSelection onSearch={handleSearch} />
        {searchCriteria ? (
          <AccommodationList searchCriteria={searchCriteria} />
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>Please select your dates and number of guests to find accommodations.</p>
          </div>
        )}
      </main>
      <BottomSheetMenu />
    </div>
  );
}
