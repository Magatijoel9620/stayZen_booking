
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import BottomSheetMenu from '@/components/BottomSheetMenu';
import { ThemeProviderComponent } from '@/components/ThemeProviderComponent';
import ThemeToggle from '@/components/ThemeToggle';

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
                <h1 className="text-2xl font-bold text-primary">StayZen</h1>
                <ThemeToggle />
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
