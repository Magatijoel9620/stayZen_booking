
"use client";

import Link from "next/link";
import Image from "next/image";
import { Accommodation, AccommodationSearchCriteria, getAvailableAccommodations } from "@/services/accommodation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { formatISO } from "date-fns";

interface AccommodationListProps {
  searchCriteria: AccommodationSearchCriteria;
}

const AccommodationList: React.FC<AccommodationListProps> = ({ searchCriteria }) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAvailableAccommodations(searchCriteria);
        setAccommodations(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch accommodations");
        setAccommodations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, [searchCriteria]);

  if (isLoading) {
    return <div className="text-center py-10">Loading accommodations...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive">Error: {error}</div>;
  }

  if (accommodations.length === 0) {
    return <div className="text-center py-10">No accommodations found matching your criteria.</div>;
  }

  const buildAccommodationLink = (accommodationId: string) => {
    const params = new URLSearchParams();
    if (searchCriteria.checkInDate) {
      params.append("checkIn", formatISO(searchCriteria.checkInDate, { representation: 'date' }));
    }
    if (searchCriteria.checkOutDate) {
      params.append("checkOut", formatISO(searchCriteria.checkOutDate, { representation: 'date' }));
    }
    params.append("guests", searchCriteria.numberOfGuests.toString());
    return `/accommodation/${accommodationId}?${params.toString()}`;
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {accommodations.map((accommodation) => (
        <Link key={accommodation.id} href={buildAccommodationLink(accommodation.id)} passHref>
          <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <div className="relative w-full h-48">
              {accommodation.imageUrls.length > 0 && (
                <Image
                  src={accommodation.imageUrls[0]}
                  alt={accommodation.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  data-ai-hint={accommodation.type === 'Apartment' ? "apartment exterior" : accommodation.type === 'Villa' ? "villa exterior" : "cabin exterior"}
                />
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl truncate">{accommodation.name}</CardTitle>
              <Badge variant="secondary" className="w-fit">{accommodation.type}</Badge>
            </CardHeader>
            <CardContent className="flex-grow pb-2">
              <CardDescription className="line-clamp-3">{accommodation.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-2">
              <p className="text-lg font-semibold">${accommodation.pricePerNight}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
              <div className="flex items-center">
                <Icons.star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm text-muted-foreground">{accommodation.rating} ({accommodation.reviewsCount})</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default AccommodationList;
