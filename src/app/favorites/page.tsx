
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function FavoritesPage() {
  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Icons.heart className="mr-2 h-6 w-6" />
            My Favorites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven't favorited any accommodations yet.
          </p>
          {/* Placeholder for future favorites list */}
        </CardContent>
      </Card>
    </div>
  );
}
