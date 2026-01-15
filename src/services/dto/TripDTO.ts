export interface CreateTripDTO {
  userId?: string;
  title: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  originCity?: string;
  originLat?: number;
  originLng?: number;
  transportMode: 'car' | 'public' | 'bike' | 'walk';
  totalBudgetEstimate?: number;
  currency?: string;
}

export interface RecommendTripDTO {
  origin: {
    city: string;
    lat?: number;
    lng?: number;
  };
  dates: {
    start: string;
    end: string;
  };
  durationDays: number;
  budget: number;
  interests: string[];
  transport: 'car' | 'public' | 'bike' | 'walk';
  timezone?: string;
  dryRun?: boolean;
}

export interface BudgetItemDTO {
  id?: string;
  category: 'transport' | 'stay' | 'food' | 'activities' | 'other';
  title: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  source: 'ai' | 'user' | 'integration';
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
