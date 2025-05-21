
"use client";

import AccommodationList from "@/components/AccommodationList";
import { Icons } from "@/components/icons";

export default function AllAccommodationsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Icons.layoutGrid className="mr-3 h-8 w-8 text-primary" />
          All Accommodations
        </h1>
      </div>
      {/* Pass no searchCriteria to fetch all accommodations */}
      <AccommodationList />
    </>
  );
}
