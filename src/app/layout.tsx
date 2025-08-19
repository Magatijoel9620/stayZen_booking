
import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import BottomSheetMenu from '@/components/BottomSheetMenu';
import { ThemeProviderComponent } from '@/components/ThemeProviderComponent';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StayZen',
  description: 'Find your perfect stay with StayZen',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/icons/stayzen.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/stayzen.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProviderComponent
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto flex h-16 items-center justify-between p-4">
                <Link href="/" className="flex items-center gap-2">
                  <Image src="/icons/stayzen.png" alt="StayZen logo" width={32} height={32} />
                  <h1 className="text-2xl font-bold text-primary">StayZen</h1>
                </Link>
                
                <div className="flex items-center gap-2">
                  <nav className="hidden md:flex gap-2">
                    <Button variant="ghost" asChild>
                      <Link href="/all-accommodations">All Stays</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/bookings">My Bookings</Link>
                    </Button>
                     <Button variant="ghost" asChild>
                      <Link href="/favorites">Favorites</Link>
                    </Button>
                     <Button variant="ghost" asChild>
                      <Link href="/profile">Profile</Link>
                    </Button>
                  </nav>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1 container mx-auto p-4 pb-32">
              {children}
            </main>
            <BottomSheetMenu />
            <Toaster />
          </div>
        </ThemeProviderComponent>
      </body>
    </html>
  );
}
