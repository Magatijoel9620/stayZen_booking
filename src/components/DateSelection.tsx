
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { AccommodationSearchCriteria } from "@/services/accommodation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

interface DateSelectionProps {
  onSearch: (criteria: AccommodationSearchCriteria) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ onSearch }) => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [isCheckInCalendarOpen, setIsCheckInCalendarOpen] = useState(false);
  const [isCheckOutCalendarOpen, setIsCheckOutCalendarOpen] = useState(false);

  const handleSearch = () => {
    if (checkInDate && checkOutDate) {
      if (checkOutDate <= checkInDate) {
        alert("Check-out date must be after check-in date.");
        return;
      }
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

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckInDate(date);
    setIsCheckInCalendarOpen(false);
    // If check-out date is before new check-in date, clear check-out date
    if (date && checkOutDate && checkOutDate <= date) {
      setCheckOutDate(undefined);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    setCheckOutDate(date);
    setIsCheckOutCalendarOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4 p-4 md:p-6 bg-card shadow-lg rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Popover open={isCheckInCalendarOpen} onOpenChange={setIsCheckInCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !checkInDate && "text-muted-foreground"
              )}
              onClick={() => setIsCheckInCalendarOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkInDate ? format(checkInDate, "PPP") : <span>Pick check-in date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkInDate}
              onSelect={handleCheckInSelect}
              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
            />
          </PopoverContent>
        </Popover>
        <Popover open={isCheckOutCalendarOpen} onOpenChange={setIsCheckOutCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !checkOutDate && "text-muted-foreground"
              )}
              onClick={() => setIsCheckOutCalendarOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick check-out date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOutDate}
              onSelect={handleCheckOutSelect}
              disabled={(date) => {
                const today = new Date(new Date().setHours(0,0,0,0));
                let minCheckoutDate = checkInDate ? new Date(checkInDate) : today;
                // Ensure minCheckoutDate is at least today if checkInDate is not set
                if (!checkInDate) minCheckoutDate = today;
                
                if (checkInDate) {
                   // Checkout must be at least one day after check-in
                  const nextDayAfterCheckIn = new Date(checkInDate);
                  nextDayAfterCheckIn.setDate(nextDayAfterCheckIn.getDate() + 1);
                  minCheckoutDate = nextDayAfterCheckIn;
                }
                 // Also, checkout date cannot be before today
                if (minCheckoutDate < today) minCheckoutDate = today;

                return date < minCheckoutDate;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Input
          type="number"
          placeholder="Number of guests"
          min={1}
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(Math.max(1, Number(e.target.value)))}
          className="w-full"
        />
      </div>
      <Button onClick={handleSearch} className="w-full" size="lg">
        <Icons.search className="mr-2 h-5 w-5" />
        Search Accommodations
      </Button>
    </div>
  );
};

export default DateSelection;
