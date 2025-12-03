import TripRepository from '../repositories/TripRepository';
import ItineraryItemRepository from '../repositories/ItineraryItemRepository';
import PlaceRepository from '../repositories/PlaceRepository';
import { CreateTripDTO, AddItineraryItemDTO, MapResponseDTO, MapMarkerDTO } from './dto/TripDTO';
import { Trip, ItineraryItem } from '../models';

class TripService {
  async createTrip(data: CreateTripDTO): Promise<Trip> {
    const trip = await TripRepository.create({
      userId: data.userId || null,
      title: data.title,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      originCity: data.originCity,
      originLat: data.originLat,
      originLng: data.originLng
    });

    return trip;
  }

  async getTripById(tripId: string): Promise<Trip | null> {
    return await TripRepository.findById(tripId);
  }

  async getUserTrips(userId: string): Promise<Trip[]> {
    return await TripRepository.findByUserId(userId);
  }

  async addItineraryItem(tripId: string, data: AddItineraryItemDTO): Promise<ItineraryItem> {
    // First, ensure the place exists in the global catalog
    const place = await PlaceRepository.findOrCreate({
      externalRef: data.googlePlaceId,
      name: data.name,
      lat: data.location.lat,
      lng: data.location.lng,
      address: data.address,
      categories: data.categories ? { types: data.categories } : undefined
    });

    // Create itinerary item with snapshot pattern
    const itineraryItem = await ItineraryItemRepository.create({
      tripId: tripId,
      placeId: place.id,
      dayIndex: data.dayIndex,
      orderIndex: data.orderIndex,
      title: data.title || data.name,
      description: data.description,
      snapshotLat: data.location.lat,
      snapshotLng: data.location.lng,
      snapshotAddress: data.address
    });

    return itineraryItem;
  }

  async getTripMapData(tripId: string): Promise<MapResponseDTO> {
    // Fetch all itinerary items for this trip
    const items = await ItineraryItemRepository.findByTripId(tripId);

    if (items.length === 0) {
      return {
        tripId,
        polyline: null,
        markers: []
      };
    }

    // Transform to markers DTO
    const markers: MapMarkerDTO[] = items.map((item) => {
      return {
        id: item.id,
        position: {
          lat: parseFloat(item.snapshotLat.toString()),
          lng: parseFloat(item.snapshotLng.toString())
        },
        title: item.title || 'Unnamed location',
        mapPinConfig: {
          glyph: (item.orderIndex + 1).toString(),
          background: this.getPinColorByDayIndex(item.dayIndex),
          borderColor: '#FFFFFF'
        },
        infoWindowContent: {
          address: item.snapshotAddress || '',
          dayIndex: item.dayIndex,
          orderIndex: item.orderIndex
        }
      };
    });

    // Calculate bounds
    const lats = markers.map(m => m.position.lat);
    const lngs = markers.map(m => m.position.lng);

    const bounds = {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs)
    };

    return {
      tripId,
      polyline: null,
      markers,
      bounds
    };
  }

  private getPinColorByDayIndex(dayIndex: number): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    return colors[dayIndex % colors.length];
  }
}

export default new TripService();
