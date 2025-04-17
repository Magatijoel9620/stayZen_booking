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
      <main className="flex-1 p-4">
        <DateSelection onSearch={handleSearch} />
        {searchCriteria && (
          <AccommodationList searchCriteria={searchCriteria} />
        )}
      </main>
      <BottomSheetMenu />
    </div>
  );
}
