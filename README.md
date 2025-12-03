# Trip Service

A microservice for managing trips (Trip Service) as part of the TravelFinder platform.

## Technology Stack

- **Node.js** + **TypeScript** - core platform
- **Express** - web framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - database

## Architecture

The project uses **Clean Architecture** with separation into layers:

```
src/
├── config/          # Configuration (database, environment variables)
├── models/          # Sequelize models
├── repositories/    # Data access layer
├── services/        # Business logic
├── controllers/     # HTTP handlers
├── routes/          # API routes
├── middlewares/     # Express middleware
├── utils/           # Utility functions
└── server.ts        # Application entry point
```

## Installation and Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure the variables:

```bash
cp .env.example .env
```

### 3. Start PostgreSQL

Make sure PostgreSQL is running and create the database:

```bash
createdb trip_service_db
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Start in Development Mode

```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Available Commands

- `npm run dev` - start in development mode with hot-reload
- `npm run build` - build TypeScript to JavaScript
- `npm start` - start production version
- `npm run db:migrate` - apply database migrations

## API Endpoints (planned)

- `POST /api/v1/trips` - create a trip
- `GET /api/v1/trips/:id` - get a trip
- `POST /api/v1/trips/:id/items` - add a place to the itinerary
- `GET /api/v1/trips/:id/map` - get map data

## Database Structure

### Schema: `trip`

- **trips** - main trips table
- **places** - places directory (Google Places cache)
- **itinerary_items** - itinerary items (with Snapshot pattern)

## Development

The project follows these principles:
- Simple and clear code
- Minimum abstractions
- Comments only where necessary (in English)
- Clean Architecture (Controller → Service → Repository)

## Project Status

**Phase 1: Project Setup** - ✅ Completed
