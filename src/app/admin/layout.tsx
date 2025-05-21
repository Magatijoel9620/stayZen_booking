
"use client"; // SidebarProvider and usePathname require client component

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminNavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const adminNavLinks: AdminNavLink[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <Icons.layoutDashboard /> },
  { href: "/admin/accommodations", label: "Accommodations", icon: <Icons.hotel /> },
  { href: "/admin/bookings", label: "Bookings", icon: <Icons.briefcase /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.shield className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
              StayZen Admin
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href))}
                    tooltip={{children: link.label}}
                  >
                    <a> {/* <a> tag needed for legacyBehavior with asChild */}
                      {link.icon}
                      <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        {/* You can add a SidebarFooter here if needed */}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="sm:hidden" /> {/* Only show trigger on mobile */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/">View Site</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
