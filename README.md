
# StayZen - Accommodation Booking App

This is a Next.js web application for finding and booking accommodations, built with Firebase Studio. It includes a user-facing application for browsing and booking, and an admin dashboard for managing properties and bookings.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **UI Components**: ShadCN UI
*   **Styling**: Tailwind CSS
*   **State Management (UI)**: React Hooks (useState, useEffect, useContext)
*   **Data Fetching/Mutation (UI)**: Async/await with services, React Hooks
*   **In-memory Data Store**: For services (accommodations, bookings, favorites) using `globalThis` for persistence in development.
*   **Generative AI**: Genkit (configured but not currently used for core features)
*   **Forms (Admin)**: React Hook Form with Zod for validation
*   **Linting/Formatting**: ESLint, Prettier (implicitly via Next.js defaults)
*   **Icons**: Lucide React
*   **Theme**: Light/Dark mode with `next-themes`

## Features

### User-Facing Application:
*   **Browse Accommodations**: View all available accommodations or search based on dates and number of guests.
*   **Detailed View**: Click on an accommodation to see detailed information, including images, description, amenities, price, and rating.
*   **Booking System**:
    *   Select check-in/check-out dates and number of guests.
    *   Book accommodations with a simulated booking process.
    *   View a list of personal bookings with status (pending, confirmed, cancelled).
*   **Favorites**:
    *   Add/remove accommodations from a personal favorites list.
    *   View a list of favorite accommodations.
    *   Quickly add/remove favorites from accommodation list and detail views.
*   **Profile Page**:
    *   Simulated profile editing (name, email).
    *   Simulated password change.
    *   Simulated notification preferences.
    *   Simulated logout.
*   **Responsive Design**: Adapts to various screen sizes.
*   **Theme Toggling**: Switch between light and dark modes.
*   **Floating Navigation Menu**: Easy access to Home, All Accommodations, My Bookings, Favorites, and Profile.
*   **Hero Section**: Engaging hero section on the homepage.
*   **Favorites Preview**: See a preview of favorite accommodations on the homepage.

### Admin Dashboard (`/admin`):
*   **Separate Admin Layout**: Dedicated sidebar navigation for admin tasks.
*   **Dashboard Overview**: Placeholder for key metrics.
*   **Accommodation Management**:
    *   View all accommodations in a table.
    *   Add new accommodations via a form with validation.
    *   Edit existing accommodations.
    *   Delete accommodations with a confirmation dialog.
*   **Booking Management**:
    *   View all customer bookings in a table.
    *   Approve pending bookings.
    *   Cancel bookings.
*   **Theme Toggling**: Available in the admin panel as well.

## Getting Started

### Prerequisites

*   Node.js (version 18.x or higher recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

1.  Start the Next.js development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will typically start the app on `http://localhost:9002`.

2.  If using Genkit for AI features (currently not implemented in the main app flow but configured):
    *   Set up your `GOOGLE_GENAI_API_KEY` in a `.env` file:
        ```env
        GOOGLE_GENAI_API_KEY=your_api_key_here
        ```
    *   Start the Genkit development server (in a separate terminal):
        ```bash
        npm run genkit:dev
        # or for watching changes
        npm run genkit:watch
        ```
    Access the admin dashboard by navigating to `/admin/dashboard` after starting the app.

## Project Structure

*   `src/app/`: Contains the pages and layouts (using Next.js App Router).
    *   `src/app/admin/`: Contains pages and layout for the admin dashboard.
*   `src/components/`: Contains reusable React components.
    *   `src/components/ui/`: ShadCN UI components.
    *   `src/components/admin/`: Components specific to the admin dashboard.
*   `src/services/`: Contains modules for interacting with data (e.g., accommodations, bookings, favorites). Uses in-memory `globalThis` for persistence during development.
*   `src/ai/`: Contains Genkit related AI flows and configurations.
*   `src/hooks/`: Custom React hooks (e.g., `useToast`, `useIsMobile`).
*   `src/lib/`: Utility functions (e.g., `cn` for classnames).
*   `public/`: Static assets.
*   `src/metadata.ts`: Centralized metadata configuration for pages.

## Available Scripts

*   `npm run dev`: Starts the Next.js development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the codebase.
*   `npm run typecheck`: Runs TypeScript type checking.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with file watching.

## Further Development

*   Implement actual user authentication (e.g., Firebase Authentication).
*   Replace in-memory data stores with a persistent database (e.g., Firebase Firestore).
*   Integrate actual payment processing for bookings.
*   Expand Genkit AI features (e.g., personalized recommendations, AI-generated descriptions, travel planning tools).
*   Add more detailed error handling and user feedback across the application.
*   Implement comprehensive testing (unit, integration, e2e).
*   Enhance admin dashboard with user management, analytics, and more detailed controls.
*   Refine UI/UX details and add animations/transitions for a more polished feel.
*   Implement image uploading for accommodations instead of URL inputs.
```