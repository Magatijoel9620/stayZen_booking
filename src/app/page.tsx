
"use client";

import { AccommodationSearchCriteria } from "@/services/accommodation";
import AccommodationList from "@/components/AccommodationList";
import DateSelection from "@/components/DateSelection";
import { useState } from "react";

export default function Home() {
  const [searchCriteria, setSearchCriteria] = useState<AccommodationSearchCriteria | null>(null);

  const handleSearch = (criteria: AccommodationSearchCriteria) => {
    setSearchCriteria(criteria);
  };

  return (
    <>
      <DateSelection onSearch={handleSearch} />
      {searchCriteria ? (
        <AccommodationList searchCriteria={searchCriteria} />
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          <p>Please select your dates and number of guests to find accommodations.</p>
        </div>
      )}
    </>
  );
}
