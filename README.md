
# StayZen - Accommodation Booking App

This is a Next.js web application for finding and booking accommodations, built with Firebase Studio.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **UI Components**: ShadCN UI
*   **Styling**: Tailwind CSS
*   **State Management (UI)**: React Hooks (useState, useEffect, useContext)
*   **Data Fetching/Mutation (UI)**: Async/await with services, React Hooks
*   **In-memory Data Store**: For services (accommodations, bookings, favorites) using globalThis for persistence in development.
*   **Generative AI**: Genkit (not currently used but configured)
*   **Linting/Formatting**: ESLint, Prettier (implicitly via Next.js defaults)
*   **Icons**: Lucide React

## Features

*   Browse all accommodations.
*   Search for accommodations based on dates and number of guests.
*   View detailed information for each accommodation.
*   Book accommodations.
*   View a list of personal bookings.
*   Add/remove accommodations from a favorites list.
*   View a list of favorite accommodations.
*   Responsive design for various screen sizes.
*   Light and Dark mode theme toggling.
*   Floating navigation menu for easy access to different sections.

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

## Project Structure

*   `src/app/`: Contains the pages and layouts (using Next.js App Router).
*   `src/components/`: Contains reusable React components, including ShadCN UI components.
*   `src/services/`: Contains modules for interacting with data (e.g., accommodations, bookings, favorites).
*   `src/ai/`: Contains Genkit related AI flows and configurations.
*   `src/hooks/`: Custom React hooks.
*   `src/lib/`: Utility functions.
*   `public/`: Static assets.

## Available Scripts

*   `npm run dev`: Starts the Next.js development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the codebase.
*   `npm run typecheck`: Runs TypeScript type checking.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with file watching.

## Further Development

*   Implement user authentication.
*   Replace in-memory data stores with a persistent database (e.g., Firebase Firestore).
*   Integrate actual payment processing.
*   Expand Genkit AI features (e.g., personalized recommendations, travel planning).
*   Add more detailed error handling and user feedback.
*   Implement comprehensive testing.
