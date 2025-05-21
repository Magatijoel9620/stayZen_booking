
import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: 'StayZen',
  description: 'Find your perfect stay with StayZen - Book hotels, villas, and apartments worldwide.',
  keywords: ['hotel booking', 'vacation rentals', 'apartments', 'villas', 'travel', 'accommodation'],
  authors: [{ name: 'Firebase Studio' }],
  openGraph: {
    title: 'StayZen',
    description: 'Find your perfect stay with StayZen.',
    type: 'website',
    // images: [ // Add a default OG image URL here
    //   {
    //     url: 'https://example.com/og-image.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'StayZen - Your next stay, simplified.',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StayZen',
    description: 'Find your perfect stay with StayZen.',
    // images: ['https://example.com/twitter-image.png'], // Add a default Twitter image URL here
    // creator: '@yourtwitterhandle', // Optional: if you have a Twitter handle
  },
  // icons: { // Optional: Add favicon and apple touch icon links
  //   icon: '/favicon.ico',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: '/site.webmanifest', // Optional: if you have a web app manifest
};

export function generatePageMetadata(pageSpecificMetadata: Metadata): Metadata {
  return {
    ...defaultMetadata,
    ...pageSpecificMetadata,
    // Deep merge OpenGraph and Twitter metadata if needed
    openGraph: {
      ...(defaultMetadata.openGraph as Record<string, unknown>), // Cast to avoid type issues with potentially undefined fields
      ...(pageSpecificMetadata.openGraph as Record<string, unknown>),
    },
    twitter: {
      ...(defaultMetadata.twitter as Record<string, unknown>),
      ...(pageSpecificMetadata.twitter as Record<string, unknown>),
    },
  };
}

// Example Usage for a specific page:
// import { generatePageMetadata } from '@/metadata';
// export const metadata = generatePageMetadata({
//   title: 'Explore Accommodations - StayZen',
//   description: 'Browse a wide variety of hotels, villas, and apartments on StayZen.',
// });
