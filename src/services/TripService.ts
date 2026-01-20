import TripRepository from '../repositories/TripRepository';
import ItineraryItemRepository from '../repositories/ItineraryItemRepository';
import PlaceRepository from '../repositories/PlaceRepository';
import BudgetItemRepository from '../repositories/BudgetItemRepository';
import RouteCacheRepository from '../repositories/RouteCacheRepository';
import AIRecommendationService from './AIRecommendationService';
import {
  CreateTripDTO,
  AddItineraryItemDTO,
  MapResponseDTO,
  MapMarkerDTO,
  RecommendTripDTO,
  RecommendTripResponseDTO,
  BudgetItemDTO,
  BudgetSummaryDTO,
} from './dto/TripDTO';
import { Trip, ItineraryItem, BudgetItem } from '../models';
import { AppError } from '../utils/errorHandler';

class TripService {
  async createTrip(data: CreateTripDTO): Promise<Trip> {
    const trip = await TripRepository.create({
      userId: data.userId || null,
      title: data.title,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      originCity: data.originCity,
      originLat: data.originLat,
      originLng: data.originLng,
      transportMode: data.transportMode,
      totalBudgetEstimate: data.totalBudgetEstimate || null,
      currency: data.currency || 'USD',
    });

    return trip;
  }

  async getTripById(tripId: string): Promise<Trip | null> {
    return await TripRepository.findById(tripId);
  }

  async getUserTrips(userId: string): Promise<Trip[]> {
    return await TripRepository.findByUserId(userId);
  }

  async deleteTrip(tripId: string): Promise<boolean> {
    const deleted = await TripRepository.delete(tripId);
    return deleted > 0;
  }

  async updateTrip(
    tripId: string,
    data: Partial<CreateTripDTO>,
  ): Promise<Trip | null> {
    const trip = await TripRepository.findById(tripId);
    if (!trip) {
      return null;
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.startDate !== undefined)
      updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.originCity !== undefined) updateData.originCity = data.originCity;
    if (data.originLat !== undefined) updateData.originLat = data.originLat;
    if (data.originLng !== undefined) updateData.originLng = data.originLng;

    await TripRepository.update(tripId, updateData);
    return await TripRepository.findById(tripId);
  }

  async addItineraryItem(
    tripId: string,
    data: AddItineraryItemDTO,
  ): Promise<ItineraryItem> {
    // First, ensure the place exists in the global catalog
    const place = await PlaceRepository.findOrCreate({
      externalRef: data.googlePlaceId,
      name: data.name,
      lat: data.location.lat,
      lng: data.location.lng,
      address: data.address,
      categories: data.categories ? { types: data.categories } : undefined,
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
      snapshotAddress: data.address,
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
        markers: [],
      };
    }

    // Transform to markers DTO
    const markers: MapMarkerDTO[] = items.map(item => {
      return {
        id: item.id,
        position: {
          lat: parseFloat(item.snapshotLat.toString()),
          lng: parseFloat(item.snapshotLng.toString()),
        },
        title: item.title || 'Unnamed location',
        mapPinConfig: {
          glyph: (item.orderIndex + 1).toString(),
          background: this.getPinColorByDayIndex(item.dayIndex),
          borderColor: '#FFFFFF',
        },
        infoWindowContent: {
          address: item.snapshotAddress || '',
          dayIndex: item.dayIndex,
          orderIndex: item.orderIndex,
        },
      };
    });

    // Calculate bounds
    const lats = markers.map(m => m.position.lat);
    const lngs = markers.map(m => m.position.lng);

    const bounds = {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };

    return {
      tripId,
      polyline: null,
      markers,
      bounds,
    };
  }

  async recommendTrip(
    data: RecommendTripDTO,
  ): Promise<RecommendTripResponseDTO | any> {
    // Call AI recommendation service
    const aiRecommendation =
      await AIRecommendationService.getRecommendations(data);

    if (data.dryRun) {
      return {
        ...aiRecommendation,
        preview: true,
      };
    }

    // Create actual trip based on AI recommendation
    const trip = await this.createTrip({
      userId: data.userId,
      title: aiRecommendation.title,
      startDate: data.dates.start,
      endDate: data.dates.end,
      originCity: data.origin.city,
      originLat: data.origin.lat,
      originLng: data.origin.lng,
      transportMode: data.transport,
      totalBudgetEstimate: aiRecommendation.total_budget_estimate,
      currency: aiRecommendation.currency,
    });

    // Create itinerary items from AI recommendation
    if (aiRecommendation.itinerary && aiRecommendation.itinerary.length > 0) {
      for (const item of aiRecommendation.itinerary) {
        // Parse start time and create full datetime
        const startDate = new Date(data.dates.start);
        const [hours, minutes] = item.start_time.split(':').map(Number);
        const plannedStartAt = new Date(startDate);
        plannedStartAt.setDate(startDate.getDate() + item.day_index);
        plannedStartAt.setHours(hours, minutes, 0, 0);

        // Calculate end time based on duration
        const plannedEndAt = new Date(plannedStartAt);
        plannedEndAt.setMinutes(
          plannedStartAt.getMinutes() + item.duration_minutes,
        );

        await ItineraryItemRepository.create({
          tripId: trip.id,
          dayIndex: item.day_index,
          orderIndex: item.order_index,
          title: item.title,
          description: item.description,
          plannedStartAt,
          plannedEndAt,
          costEstimate: item.estimated_cost,
          snapshotLat: item.coordinates.lat,
          snapshotLng: item.coordinates.lng,
          snapshotPlaceName: item.place_name,
          snapshotAddress: null, // AI doesn't provide address, could be enhanced later
        });
      }
    }

    // Get trip with itinerary items
    const tripWithItinerary = await this.getTripById(trip.id);

    // Get map data for the created trip
    const mapData = await this.getTripMapData(trip.id);

    return {
      trip: tripWithItinerary,
      mapData,
    };
  }

  async cloneTrip(tripId: string, userId?: string): Promise<Trip> {
    const originalTrip = await TripRepository.findById(tripId);
    if (!originalTrip) {
      throw new AppError('Trip not found', 404);
    }

    const clonedTrip = await TripRepository.create({
      userId: userId || originalTrip.userId,
      title: `${originalTrip.title} (Copy)`,
      summary: originalTrip.summary,
      startDate: originalTrip.startDate,
      endDate: originalTrip.endDate,
      originCity: originalTrip.originCity,
      originLat: originalTrip.originLat,
      originLng: originalTrip.originLng,
      transportMode: originalTrip.transportMode,
      totalBudgetEstimate: originalTrip.totalBudgetEstimate,
      currency: originalTrip.currency,
      status: 'draft',
    });

    // Clone itinerary items
    const originalItems = await ItineraryItemRepository.findByTripId(tripId);
    for (const item of originalItems) {
      await ItineraryItemRepository.create({
        tripId: clonedTrip.id,
        placeId: item.placeId,
        dayIndex: item.dayIndex,
        orderIndex: item.orderIndex,
        title: item.title,
        description: item.description,
        plannedStartAt: item.plannedStartAt,
        plannedEndAt: item.plannedEndAt,
        transportSegment: item.transportSegment,
        costEstimate: item.costEstimate,
        snapshotLat: item.snapshotLat,
        snapshotLng: item.snapshotLng,
        snapshotPlaceName: item.snapshotPlaceName,
        snapshotAddress: item.snapshotAddress,
      });
    }

    return clonedTrip;
  }

  async createShareSlug(tripId: string): Promise<string> {
    const trip = await TripRepository.findById(tripId);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    const shareSlug = this.generateShareSlug();
    await TripRepository.update(tripId, {
      shareSlug,
      visibility: 'unlisted',
    });

    return shareSlug;
  }

  async getTripByShareSlug(shareSlug: string): Promise<Trip | null> {
    return await TripRepository.findByShareSlug(shareSlug);
  }

  async addBudgetItem(
    tripId: string,
    data: BudgetItemDTO,
  ): Promise<BudgetItem> {
    const trip = await TripRepository.findById(tripId);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    const budgetItem = await BudgetItemRepository.create({
      tripId,
      category: data.category,
      title: data.title,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      currency: data.currency,
      source: data.source,
      linkedItineraryItemId: data.linkedItineraryItemId || null,
    });

    return budgetItem;
  }

  async updateBudgetItem(
    itemId: string,
    data: Partial<BudgetItemDTO>,
  ): Promise<BudgetItem | null> {
    const item = await BudgetItemRepository.findById(itemId);
    if (!item) {
      return null;
    }

    await BudgetItemRepository.update(itemId, data);
    return await BudgetItemRepository.findById(itemId);
  }

  async getBudgetSummary(tripId: string): Promise<BudgetSummaryDTO> {
    return await BudgetItemRepository.getBudgetSummary(tripId);
  }

  async updateItinerary(
    tripId: string,
    items: any[],
  ): Promise<ItineraryItem[]> {
    const trip = await TripRepository.findById(tripId);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    // Delete existing items
    await ItineraryItemRepository.deleteByTripId(tripId);

    // Create new items
    const createdItems: ItineraryItem[] = [];
    for (const itemData of items) {
      const item = await ItineraryItemRepository.create({
        tripId,
        ...itemData,
      });
      createdItems.push(item);
    }

    return createdItems;
  }

  async updateItineraryItem(
    tripId: string,
    itemId: string,
    data: any,
  ): Promise<ItineraryItem | null> {
    const item = await ItineraryItemRepository.findById(itemId);
    if (!item || item.tripId !== tripId) {
      return null;
    }

    await ItineraryItemRepository.update(itemId, data);
    return await ItineraryItemRepository.findById(itemId);
  }

  private generateShareSlug(): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getPinColorByDayIndex(dayIndex: number): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
    ];
    return colors[dayIndex % colors.length];
  }
}

export default new TripService();
