export interface CreateTripDTO {
  userId?: string;
  title: string;
  startDate: string;
  endDate: string;
  originCity?: string;
  originLat?: number;
  originLng?: number;
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
