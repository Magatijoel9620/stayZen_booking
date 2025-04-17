"use client";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { AccommodationSearchCriteria, Location } from "@/services/accommodation";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface DateSelectionProps {
  onSearch: (criteria: AccommodationSearchCriteria) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ onSearch }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);

  const handleSearch = () => {
    if (checkInDate && checkOutDate) {
      const searchCriteria: AccommodationSearchCriteria = {
        location: { lat: 34.0522, lng: -118.2437 }, // Example location
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        numberOfGuests: numberOfGuests,
      };
      onSearch(searchCriteria);
    } else {
      alert("Please select both check-in and check-out dates.");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !checkInDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkInDate ? format(checkInDate, "PPP") : <span>Pick check-in date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkInDate}
              onSelect={setCheckInDate}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !checkOutDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick check-out date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOutDate}
              onSelect={setCheckOutDate}
              disabled={(date) => date < (checkInDate || new Date())}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Input
          type="number"
          placeholder="Number of guests"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(Number(e.target.value))}
        />
      </div>
      <Button onClick={handleSearch}>Search Accommodations</Button>
    </div>
  );
};

export default DateSelection;
