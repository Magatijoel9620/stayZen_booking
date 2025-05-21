
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Icons.layoutDashboard className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>This is your control panel for StayZen.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>From here, you can manage accommodations, bookings, and other application settings.</p>
          <p className="mt-4">Select an option from the sidebar to get started.</p>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accommodations</CardTitle>
            <Icons.hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              (Placeholder - to be implemented)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Icons.briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
               (Placeholder - to be implemented)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Icons.check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              (Placeholder - to be implemented)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
