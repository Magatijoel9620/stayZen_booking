
"use client";

import { AccommodationSearchCriteria } from "@/services/accommodation";
import AccommodationList from "@/components/AccommodationList";
import DateSelection from "@/components/DateSelection";
import FavoriteAccommodationsPreview from "@/components/FavoriteAccommodationsPreview";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Home() {
  const [searchCriteria, setSearchCriteria] = useState<AccommodationSearchCriteria | null>(null);

  const handleSearch = (criteria: AccommodationSearchCriteria) => {
    setSearchCriteria(criteria);
  };

  const heroIllustrationHint = "beach illustration";
  const heroPlaceholderImageUrl = `https://placehold.co/1600x900.png`;

  return (
    <div className="space-y-12 md:space-y-16"> {/* Overall spacing for sections */}
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] sm:h-[60vh] md:h-[70vh] flex items-center justify-center text-center rounded-xl overflow-hidden shadow-2xl">
        <Image
          src={heroPlaceholderImageUrl} 
          alt="Beautiful travel destination illustration"
          layout="fill"
          objectFit="cover"
          priority
          className="z-0"
          data-ai-hint={heroIllustrationHint} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" /> {/* Gradient overlay for better text readability */}
        <div className="relative z-20 p-4 sm:p-8 text-white max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Discover Your Next <span className="text-cta brightness-110">Perfect Stay</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 font-light max-w-2xl mx-auto"
             style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            Explore unique accommodations, from cozy apartments to luxurious villas.
            Your dream vacation is just a few clicks away.
          </p>
        </div>
      </section>

      {/* Date Selection Section */}
      <section id="date-selection" className="scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <DateSelection onSearch={handleSearch} />
        </div>
      </section>

      {/* Search Results or Prompt Section */}
      {searchCriteria ? (
        <section>
          <div className="flex items-center mb-4 sm:mb-6">
            <Icons.search className="mr-3 h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Search Results
            </h2>
          </div>
          <AccommodationList searchCriteria={searchCriteria} />
        </section>
      ) : (
        <section>
          <div className="text-center py-10 sm:py-12 px-6 text-muted-foreground bg-card border-2 border-dashed border-border/70 rounded-xl shadow-sm">
            <Icons.calendarDays className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 text-primary/50" />
            <p className="text-xl sm:text-2xl font-semibold text-foreground mb-2">Ready for an Adventure?</p>
            <p className="text-sm sm:text-base max-w-md mx-auto">
              Select your check-in, check-out dates, and number of guests above to find amazing places to stay.
            </p>
          </div>
        </section>
      )}
      
      <Separator className="my-8 md:my-12" />

      {/* Favorite Accommodations Preview Section */}
      <section>
        <div className="flex items-center mb-6 sm:mb-8">
          <Icons.heart className="mr-3 h-7 w-7 sm:h-8 sm:w-8 text-destructive" />
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Your Favorite Stays
          </h2>
        </div>
        <FavoriteAccommodationsPreview />
      </section>
    </div>
  );
}
