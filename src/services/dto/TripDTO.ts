import { Trip } from '../../models';

export interface CreateTripDTO {
  userId: string;
  title: string;
  summary?: string | undefined;
  startDate: string;
  endDate: string;
  originCity?: string;
  originLat?: number;
  originLng?: number;
  transportMode: 'car' | 'public' | 'bike' | 'walk';
  totalBudgetEstimate?: number;
  currency?: string;
}

export interface RecommendTripDTO {
  userId: string;
  origin: {
    city: string;
    lat?: number;
    lng?: number;
  };
  dates: {
    start: string;
    end: string;
  };
  budget: number;
  interests: string[];
  transport: 'car' | 'public' | 'bike' | 'walk';
  timezone?: string;
  dryRun?: boolean;
  currency?: string;
  language?: string;
}

export interface BudgetItemDTO {
  id?: string;
  category: 'transport' | 'stay' | 'food' | 'activities' | 'other';
  amount: number;
  currency: string;
  description?: string;
  date?: string;
  linkedItineraryItemId?: string;
}

export interface BudgetSummaryDTO {
  totalAmount: number;
  currency: string;
  categories: {
    [key: string]: {
      amount: number;
      items: number;
    };
  };
}

export interface AddItineraryItemDTO {
  googlePlaceId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
  categories?: string[];
  dayIndex: number;
  orderIndex: number;
  title?: string;
  description?: string;
}

export interface MapMarkerDTO {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  mapPinConfig: {
    glyph?: string;
    background?: string;
    borderColor?: string;
  };
  infoWindowContent: {
    address: string;
    dayIndex: number;
    orderIndex: number;
  };
}

export interface MapResponseDTO {
  tripId: string;
  polyline: string | null;
  markers: MapMarkerDTO[];
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface RecommendTripResponseDTO {
  trip: Trip;
  mapData: MapResponseDTO;
  preview?: boolean;
}
