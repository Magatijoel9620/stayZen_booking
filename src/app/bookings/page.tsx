
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function BookingsPage() {
  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Icons.briefcase className="mr-2 h-6 w-6" />
            My Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You have no bookings yet. Start exploring and book your next adventure!
          </p>
          {/* Placeholder for future booking list */}
        </CardContent>
      </Card>
    </div>
  );
}
