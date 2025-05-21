
"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

const BottomSheetMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-background/70 z-50">
      <div className="flex justify-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="rounded-full shadow-lg w-16 h-16 flex items-center justify-center bg-cta text-primary-foreground hover:bg-cta/80">
              <Icons.menu className="w-8 h-8" />
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-sm">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="grid gap-3 py-4">
              <Link href="/" passHref>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Icons.home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </SheetClose>
              </Link>
              <Link href="/all-accommodations" passHref>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Icons.layoutGrid className="mr-2 h-4 w-4" />
                    All Accommodations
                  </Button>
                </SheetClose>
              </Link>
              <Link href="/bookings" passHref>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Icons.briefcase className="mr-2 h-4 w-4" />
                    My Bookings
                  </Button>
                </SheetClose>
              </Link>
              <Link href="/favorites" passHref>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Icons.heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Button>
                </SheetClose>
              </Link>
              <Link href="/profile" passHref>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Icons.user className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </SheetClose>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default BottomSheetMenu;
