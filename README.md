# Humble Superhero API

## Tech Stack

### Backend

- Express.js - Fast, unopinionated web framework for Node.js
- Redis - In-memory data store
- express-validator - Middleware for input validation
- Jest + supertest - Testing framework and HTTP testing library
- TypeScript

### Frontend

- Next.js - React framework for production
- Tailwind CSS - Utility-first CSS framework
- Hero UI - UI Library (uses shadcn)
- Sonner - Toasts
- TypeScript

### Hosting

- Railway - Backend hosting
- Vercel - Frontend hosting

## Project Structure

```
humble-superhero/
├── api/              # Backend Express.js application
├── client/          # Frontend Next.js application
└── README.md        # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Redis
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd humble-superhero
```

2. Install Backend Dependencies

```bash
cd api
npm install
```

3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

4. Set up environment variables
   Create `.env` files in both api and client directories following the `.env.example` templates.

### Running the Application

#### Backend

```bash
cd api
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

## API Endpoints

### POST /superheroes

Add a new superhero to the database.

Request body:

```json
{
  "name": "string",
  "superpower": "string",
  "humilityScore": number (1-10)
}
```

### GET /superheroes

Fetch all superheroes sorted by humility score in descending order.

Detailed endpoints are on the site's docs section.

## Testing

```bash
cd api
npm run test
```

## Team Collaboration Notes

As a team player, here are some areas where we could collaborate to improve this project:

- Code review sessions to ensure best practices
- Pair programming for complex features
- Regular sync-ups to discuss architectural decisions
- Knowledge sharing sessions about the tech stack

## If I Had More Time

Here are some improvements and features I would like to add:

1. Add authentication and user profiles
2. Implement real-time updates using WebSocket
3. Add more comprehensive test coverage (for new endpoints)
4. Improved validation (such as adding to other endpoints and frontend)
5. Add superhero categories or tags
6. Create a more sophisticated scoring system
7. Add caching client-side to improve fetch time
