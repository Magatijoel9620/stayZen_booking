
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
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";


interface DateSelectionProps {
  onSearch: (criteria: AccommodationSearchCriteria) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ onSearch }) => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [isCheckInCalendarOpen, setIsCheckInCalendarOpen] = useState(false);
  const [isCheckOutCalendarOpen, setIsCheckOutCalendarOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!checkInDate) {
      toast({ title: "Missing Information", description: "Please select a check-in date.", variant: "destructive" });
      return;
    }
    if (!checkOutDate) {
      toast({ title: "Missing Information", description: "Please select a check-out date.", variant: "destructive" });
      return;
    }
    if (checkOutDate <= checkInDate) {
      toast({ title: "Invalid Dates", description: "Check-out date must be after check-in date.", variant: "destructive" });
      return;
    }
    if (numberOfGuests <= 0) {
      toast({ title: "Invalid Guests", description: "Number of guests must be at least 1.", variant: "destructive" });
      return;
    }

    const searchCriteria: AccommodationSearchCriteria = {
      location: { lat: 34.0522, lng: -118.2437 }, // Example location
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      numberOfGuests: numberOfGuests,
    };
    onSearch(searchCriteria);
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
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);


  return (
    <div className="flex flex-col space-y-4 p-4 md:p-6 bg-card shadow-lg rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="check-in-date" className="mb-1.5 block text-sm font-medium">Check-in Date</Label>
          <Popover open={isCheckInCalendarOpen} onOpenChange={setIsCheckInCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="check-in-date"
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
                disabled={(date) => date < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="check-out-date" className="mb-1.5 block text-sm font-medium">Check-out Date</Label>
          <Popover open={isCheckOutCalendarOpen} onOpenChange={setIsCheckOutCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="check-out-date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkOutDate && "text-muted-foreground"
                )}
                onClick={() => setIsCheckOutCalendarOpen(true)}
                disabled={!checkInDate}
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
                  let minCheckoutDate = new Date(today);
                  if (checkInDate) {
                    const nextDayAfterCheckIn = new Date(checkInDate);
                    nextDayAfterCheckIn.setDate(nextDayAfterCheckIn.getDate() + 1);
                    minCheckoutDate = nextDayAfterCheckIn > today ? nextDayAfterCheckIn : today;
                  }
                  return date < minCheckoutDate;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <Label htmlFor="number-of-guests" className="mb-1.5 block text-sm font-medium">Number of Guests</Label>
        <Input
          id="number-of-guests"
          type="number"
          placeholder="Number of guests"
          min={1}
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(Math.max(1, Number(e.target.value)))}
          className="w-full"
        />
      </div>
      <Button onClick={handleSearch} className="w-full bg-cta hover:bg-cta/90 text-primary-foreground" size="lg">
        <Icons.search className="mr-2 h-5 w-5" />
        Search Accommodations
      </Button>
    </div>
  );
};

export default DateSelection;
