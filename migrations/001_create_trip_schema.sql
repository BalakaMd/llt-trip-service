-- Create schema
CREATE SCHEMA IF NOT EXISTS trip;

-- Create enums
CREATE TYPE trip.trip_status_enum AS ENUM ('draft', 'final');
CREATE TYPE trip.visibility_enum AS ENUM ('private', 'public', 'shared');

-- Create trips table
CREATE TABLE trip.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    origin_city VARCHAR(255),
    origin_lat NUMERIC(9,6),
    origin_lng NUMERIC(9,6),
    status trip.trip_status_enum DEFAULT 'draft',
    visibility trip.visibility_enum DEFAULT 'private',
    share_slug VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create places table
CREATE TABLE trip.places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_ref VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    address TEXT,
    categories JSONB,
    rating NUMERIC(2,1),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create itinerary_items table with snapshot fields
CREATE TABLE trip.itinerary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trip.trips(id) ON DELETE CASCADE,
    place_id UUID REFERENCES trip.places(id) ON DELETE SET NULL,
    day_index INT NOT NULL,
    order_index INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    snapshot_lat NUMERIC(9,6) NOT NULL,
    snapshot_lng NUMERIC(9,6) NOT NULL,
    snapshot_address TEXT,
    planned_start_at TIMESTAMPTZ,
    planned_end_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(trip_id, day_index, order_index)
);

-- Create indexes for performance
CREATE INDEX idx_trips_user ON trip.trips(user_id);
CREATE INDEX idx_trips_share_slug ON trip.trips(share_slug);
CREATE INDEX idx_itinerary_trip ON trip.itinerary_items(trip_id);
CREATE INDEX idx_places_external_ref ON trip.places(external_ref);
