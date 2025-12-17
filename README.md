# LittleLifeTrip Trip Service API Documentation

A microservice for managing trips (LittleLifeTrip) as part of the LittleLifeTrip platform.

## Technology Stack

- **Node.js** + **TypeScript** - core platform
- **Express** - web framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - database
- **Joi** - validation

## Architecture

The project uses **Clean Architecture** with separation into layers:

```
src/
├── config/          # Configuration (database, environment variables)
├── models/          # Sequelize models
├── repositories/    # Data access layer
├── services/        # Business logic
├── controllers/     # HTTP handlers
├── db/              # Database models
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

## Quick start (Docker)

`docker compose up --build`

- Service: http://localhost:3000
- Swagger: http://localhost:3000/auth/docs
- Postgres container for this service is included in `docker-compose.yml`.

## Local dev (without Docker)

```
npm i
npm run dev # nodemon
```

The server will be available at `http://localhost:3000`

## API Documentation

Interactive API documentation is available via Swagger UI:

**URL**: `http://localhost:3000/trip/docs`

The documentation includes:
- All available endpoints
- Request/response schemas
- Try-it-out functionality

## API Endpoints

- `POST /api/v1/trips` - create a trip
- `GET /api/v1/trips/:id` - get a trip
- `DELETE /api/v1/trips/:id` - delete a trip
- `PATCH /api/v1/trips/:id` - update a trip
- `GET /api/v1/users/:userId/trips` - get user's trips
- `POST /api/v1/trips/:id/items` - add a place to the itinerary
- `GET /api/v1/trips/:id/map` - get map data for Google Maps

## Database Structure

### Schema:

- **trips** - main trips table
- **places** - places directory (Google Places cache)
- **itinerary_items** - itinerary items (with Snapshot pattern)
