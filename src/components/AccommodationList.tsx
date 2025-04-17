"use client";

import { Accommodation, AccommodationSearchCriteria, getAvailableAccommodations } from "@/services/accommodation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    return <div>Loading accommodations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {accommodations.map((accommodation) => (
        <Card key={accommodation.id}>
          <CardHeader>
            <CardTitle>{accommodation.name}</CardTitle>
            <CardDescription>{accommodation.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Price: ${accommodation.pricePerNight}/night</p>
            {accommodation.imageUrls.length > 0 && (
              <img
                src={accommodation.imageUrls[0]}
                alt={accommodation.name}
                className="rounded-md h-48 w-full object-cover"
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AccommodationList;
