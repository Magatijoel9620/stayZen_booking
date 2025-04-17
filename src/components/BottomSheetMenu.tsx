"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BookOpen, MapPin, Settings } from "lucide-react";

const BottomSheetMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-background/70 backdrop-blur-md z-50">
      <div className="flex justify-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="rounded-full shadow-lg w-16 h-16 flex items-center justify-center bg-cta text-primary-foreground hover:bg-cta/80">
              <BookOpen className="w-8 h-8" />
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-sm">
            <div className="grid gap-4">
              <p>Menu Content</p>
              <Button variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Browse Map
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default BottomSheetMenu;
