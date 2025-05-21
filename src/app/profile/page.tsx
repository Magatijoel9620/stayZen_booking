
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// import type { Metadata } from 'next';
// import { generatePageMetadata } from '@/metadata'; // Adjust path as necessary

// export const metadata = generatePageMetadata({
//   title: 'My Profile - StayZen',
//   description: 'View and manage your StayZen user profile.',
// });


export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Placeholder profile data, can be updated by the "Edit Profile" dialog
  const [userName, setUserName] = useState("Demo User");
  const [userEmail, setUserEmail] = useState("demo.user@example.com");

  // Placeholder notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);


  const handleEditProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newName = formData.get("name") as string;
    const newEmail = formData.get("email") as string;

    if (newName.trim()) setUserName(newName);
    // Basic email validation for demo purposes
    if (newEmail.trim() && newEmail.includes('@')) setUserEmail(newEmail);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated (simulated).",
    });
    setIsEditProfileOpen(false);
  };

  const handleChangePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd validate passwords (e.g., new password matches confirm password)
    toast({
      title: "Password Changed",
      description: "Your password has been successfully changed (simulated).",
    });
    setIsChangePasswordOpen(false);
  };

  const handleSaveNotifications = () => {
    // In a real app, you would save these preferences to a backend
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been saved (simulated).",
    });
    setIsNotificationsOpen(false);
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out (simulated).",
    });
    router.push('/');
  };


  return (
    <>
      <Card className="shadow-lg max-w-lg mx-auto">
        <CardHeader className="items-center text-center pt-6 pb-4">
          <Avatar className="h-24 w-24 mb-4 border-2 border-primary/20 shadow-sm">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${userName.charAt(0).toUpperCase()}`} alt={`${userName}'s Avatar`} data-ai-hint="person avatar" />
            <AvatarFallback className="text-2xl bg-muted">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl sm:text-3xl">{userName}</CardTitle>
          <CardDescription className="text-sm sm:text-base">{userEmail}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6 pt-4">
          <div className="space-y-3">
            <h3 className="text-md sm:text-lg font-semibold flex items-center text-muted-foreground mb-1">
              <Icons.settings className="mr-2 h-5 w-5" />
              Account Settings
            </h3>
            <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" onClick={() => setIsEditProfileOpen(true)}>
              <Icons.edit className="mr-3 h-4 w-4" /> Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" onClick={() => setIsChangePasswordOpen(true)}>
              <Icons.shield className="mr-3 h-4 w-4" /> Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" onClick={() => setIsNotificationsOpen(true)}>
              <Icons.mail className="mr-3 h-4 w-4" /> Notification Preferences
            </Button>
          </div>
        </CardContent>
        <CardFooter className="px-4 sm:px-6 pb-6 pt-4">
          <Button variant="destructive" className="w-full text-base py-3 h-auto" onClick={handleLogout}>
            <Icons.logOut className="mr-2 h-5 w-5" /> Log Out
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProfileSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={userName} placeholder="Enter your full name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" defaultValue={userEmail} placeholder="Enter your email address" />
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Choose a new strong password for your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" name="current-password" type="password" placeholder="Enter your current password" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" name="new-password" type="password" placeholder="Enter your new password" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" name="confirm-password" type="password" placeholder="Confirm your new password" />
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Change Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Notification Preferences Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogDescription>
              Manage how you receive important updates from StayZen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-0.5 cursor-pointer">
                <span>Email Notifications</span>
                <span className="text-xs font-normal leading-snug text-muted-foreground">
                  Receive booking confirmations and updates.
                </span>
              </Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                aria-label="Toggle email notifications"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-0.5 cursor-pointer">
                <span>Push Notifications</span>
                <span className="text-xs font-normal leading-snug text-muted-foreground">
                  Get real-time alerts for special offers.
                </span>
              </Label>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                aria-label="Toggle push notifications"
              />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow">
              <Label htmlFor="sms-notifications" className="flex flex-col space-y-0.5 cursor-pointer">
                <span>SMS Alerts</span>
                <span className="text-xs font-normal leading-snug text-muted-foreground">
                  Critical alerts via text message.
                </span>
              </Label>
              <Switch
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
                aria-label="Toggle SMS alerts"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveNotifications}>Save Preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
