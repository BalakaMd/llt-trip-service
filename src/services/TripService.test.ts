import { AppError } from '../utils/errorHandler';

// Create mock functions
const mockFindById = jest.fn();
const mockFindByUserId = jest.fn();
const mockFindByShareSlug = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

const mockFindByTripId = jest.fn();
const mockItemFindById = jest.fn();
const mockItemCreate = jest.fn();
const mockItemUpdate = jest.fn();
const mockDeleteByTripId = jest.fn();

const mockFindOrCreate = jest.fn();

const mockBudgetFindById = jest.fn();
const mockBudgetCreate = jest.fn();
const mockBudgetUpdate = jest.fn();
const mockGetBudgetSummary = jest.fn();

// Mock repositories
jest.mock('../repositories/TripRepository', () => ({
  __esModule: true,
  default: {
    findById: mockFindById,
    findByUserId: mockFindByUserId,
    findByShareSlug: mockFindByShareSlug,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  },
}));

jest.mock('../repositories/ItineraryItemRepository', () => ({
  __esModule: true,
  default: {
    findByTripId: mockFindByTripId,
    findById: mockItemFindById,
    create: mockItemCreate,
    update: mockItemUpdate,
    deleteByTripId: mockDeleteByTripId,
  },
}));

jest.mock('../repositories/PlaceRepository', () => ({
  __esModule: true,
  default: {
    findOrCreate: mockFindOrCreate,
  },
}));

jest.mock('../repositories/BudgetItemRepository', () => ({
  __esModule: true,
  default: {
    findById: mockBudgetFindById,
    create: mockBudgetCreate,
    update: mockBudgetUpdate,
    getBudgetSummary: mockGetBudgetSummary,
  },
}));

jest.mock('../repositories/RouteCacheRepository', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('./AIRecommendationService', () => ({
  __esModule: true,
  default: {
    getRecommendations: jest.fn(),
  },
}));

import TripService from './TripService';

describe('TripService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTrip', () => {
    it('should create a trip with valid data', async () => {
      const tripData = {
        userId: 'user-123',
        title: 'Test Trip',
        startDate: '2024-01-01',
        endDate: '2024-01-05',
        originCity: 'Kyiv',
        originLat: 50.4501,
        originLng: 30.5234,
        transportMode: 'car' as const,
        currency: 'UAH',
      };

      const mockTrip = {
        id: 'trip-123',
        ...tripData,
        startDate: new Date(tripData.startDate),
        endDate: new Date(tripData.endDate),
      };

      mockCreate.mockResolvedValue(mockTrip as any);

      const result = await TripService.createTrip(tripData);

      expect(mockCreate).toHaveBeenCalledWith({
        userId: 'user-123',
        title: 'Test Trip',
        summary: null,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        originCity: 'Kyiv',
        originLat: 50.4501,
        originLng: 30.5234,
        transportMode: 'car',
        totalBudgetEstimate: null,
        currency: 'UAH',
      });
      expect(result).toEqual(mockTrip);
    });

    it('should use default currency USD if not provided', async () => {
      const tripData = {
        userId: 'user-123',
        title: 'Test Trip',
        startDate: '2024-01-01',
        endDate: '2024-01-05',
        transportMode: 'walk' as const,
      };

      mockCreate.mockResolvedValue({ id: 'trip-123' } as any);

      await TripService.createTrip(tripData);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ currency: 'USD' }),
      );
    });
  });

  describe('getTripById', () => {
    it('should return trip when found', async () => {
      const mockTrip = { id: 'trip-123', userId: 'user-123', title: 'Test' };
      mockFindById.mockResolvedValue(mockTrip as any);

      const result = await TripService.getTripById('trip-123');

      expect(result).toEqual(mockTrip);
      expect(mockFindById).toHaveBeenCalledWith('trip-123');
    });

    it('should return null when trip not found', async () => {
      mockFindById.mockResolvedValue(null);

      const result = await TripService.getTripById('non-existent');

      expect(result).toBeNull();
    });

    it('should throw 403 when user does not own the trip', async () => {
      const mockTrip = { id: 'trip-123', userId: 'user-123', title: 'Test' };
      mockFindById.mockResolvedValue(mockTrip as any);

      await expect(
        TripService.getTripById('trip-123', 'other-user'),
      ).rejects.toThrow(AppError);

      await expect(
        TripService.getTripById('trip-123', 'other-user'),
      ).rejects.toThrow('Forbidden: You do not own this trip');
    });
  });

  describe('getUserTrips', () => {
    it('should return trips for the user', async () => {
      const mockTrips = [
        { id: 'trip-1', userId: 'user-123' },
        { id: 'trip-2', userId: 'user-123' },
      ];
      mockFindByUserId.mockResolvedValue(mockTrips as any);

      const result = await TripService.getUserTrips('user-123', 'user-123');

      expect(result).toEqual(mockTrips);
      expect(mockFindByUserId).toHaveBeenCalledWith('user-123');
    });

    it('should throw 403 when requesting other user trips', async () => {
      await expect(
        TripService.getUserTrips('user-123', 'other-user'),
      ).rejects.toThrow('Forbidden: You can only view your own trips');
    });
  });

  describe('deleteTrip', () => {
    it('should delete trip when user owns it', async () => {
      const mockTrip = { id: 'trip-123', userId: 'user-123' };
      mockFindById.mockResolvedValue(mockTrip as any);
      mockDelete.mockResolvedValue(1);

      const result = await TripService.deleteTrip('trip-123', 'user-123');

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith('trip-123');
    });

    it('should throw 404 when trip not found', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        TripService.deleteTrip('non-existent', 'user-123'),
      ).rejects.toThrow('Trip not found');
    });

    it('should throw 403 when user does not own the trip', async () => {
      const mockTrip = { id: 'trip-123', userId: 'user-123' };
      mockFindById.mockResolvedValue(mockTrip as any);

      await expect(
        TripService.deleteTrip('trip-123', 'other-user'),
      ).rejects.toThrow('Forbidden: You do not own this trip');
    });
  });

  describe('updateTrip', () => {
    it('should update trip with valid data', async () => {
      const mockTrip = {
        id: 'trip-123',
        userId: 'user-123',
        title: 'Old Title',
      };
      const updatedTrip = { ...mockTrip, title: 'New Title' };

      mockFindById
        .mockResolvedValueOnce(mockTrip as any)
        .mockResolvedValueOnce(updatedTrip as any);
      mockUpdate.mockResolvedValue(1);

      const result = await TripService.updateTrip(
        'trip-123',
        { title: 'New Title' },
        'user-123',
      );

      expect(result).toEqual(updatedTrip);
      expect(mockUpdate).toHaveBeenCalledWith('trip-123', {
        title: 'New Title',
      });
    });
  });

  describe('getTripMapData', () => {
    it('should return empty markers when no itinerary items', async () => {
      const mockTrip = { id: 'trip-123', userId: 'user-123' };
      mockFindById.mockResolvedValue(mockTrip as any);
      mockFindByTripId.mockResolvedValue([]);

      const result = await TripService.getTripMapData('trip-123', 'user-123');

      expect(result).toEqual({
        tripId: 'trip-123',
        polyline: null,
        markers: [],
      });
    });

    it('should return markers with correct format', async () => {
      const mockTrip = { id: 'trip-123', userId: 'user-123' };
      const mockItems = [
        {
          id: 'item-1',
          snapshotLat: 50.4501,
          snapshotLng: 30.5234,
          title: 'Location 1',
          snapshotAddress: 'Address 1',
          dayIndex: 0,
          orderIndex: 0,
        },
        {
          id: 'item-2',
          snapshotLat: 50.4601,
          snapshotLng: 30.5334,
          title: 'Location 2',
          snapshotAddress: 'Address 2',
          dayIndex: 0,
          orderIndex: 1,
        },
      ];

      mockFindById.mockResolvedValue(mockTrip as any);
      mockFindByTripId.mockResolvedValue(mockItems as any);

      const result = await TripService.getTripMapData('trip-123', 'user-123');

      expect(result.markers).toHaveLength(2);
      expect(result.markers[0]).toMatchObject({
        id: 'item-1',
        position: { lat: 50.4501, lng: 30.5234 },
        title: 'Location 1',
      });
      expect(result.bounds).toBeDefined();
      expect(result.bounds!.north).toBe(50.4601);
      expect(result.bounds!.south).toBe(50.4501);
    });
  });

  describe('addItineraryItem', () => {
    it('should add itinerary item with place creation', async () => {
      const mockTrip = { id: 'trip-123', userId: 'user-123' };
      const mockPlace = { id: 'place-123' };
      const mockItem = { id: 'item-123', tripId: 'trip-123' };

      mockFindById.mockResolvedValue(mockTrip as any);
      mockFindOrCreate.mockResolvedValue(mockPlace as any);
      mockItemCreate.mockResolvedValue(mockItem as any);

      const result = await TripService.addItineraryItem(
        'trip-123',
        {
          googlePlaceId: 'google-123',
          name: 'Test Place',
          location: { lat: 50.45, lng: 30.52 },
          address: 'Test Address',
          dayIndex: 0,
          orderIndex: 0,
        },
        'user-123',
      );

      expect(result).toEqual(mockItem);
      expect(mockFindOrCreate).toHaveBeenCalled();
      expect(mockItemCreate).toHaveBeenCalled();
    });
  });

  describe('cloneTrip', () => {
    it('should clone own trip', async () => {
      const mockTrip = {
        id: 'trip-123',
        userId: 'user-123',
        title: 'Original Trip',
        summary: 'Summary',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        originCity: 'Kyiv',
        originLat: 50.45,
        originLng: 30.52,
        transportMode: 'car',
        totalBudgetEstimate: 1000,
        currency: 'UAH',
        visibility: 'private',
      };
      const clonedTrip = {
        ...mockTrip,
        id: 'trip-456',
        title: 'Original Trip (Copy)',
      };

      mockFindById.mockResolvedValue(mockTrip as any);
      mockCreate.mockResolvedValue(clonedTrip as any);
      mockFindByTripId.mockResolvedValue([]);

      const result = await TripService.cloneTrip('trip-123', 'user-123');

      expect(result.title).toBe('Original Trip (Copy)');
      expect(mockCreate).toHaveBeenCalled();
    });

    it('should throw 404 when trip not found', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        TripService.cloneTrip('non-existent', 'user-123'),
      ).rejects.toThrow('Trip not found');
    });

    it('should throw 403 when cloning private trip of another user', async () => {
      const mockTrip = {
        id: 'trip-123',
        userId: 'other-user',
        visibility: 'private',
      };
      mockFindById.mockResolvedValue(mockTrip as any);

      await expect(
        TripService.cloneTrip('trip-123', 'user-123'),
      ).rejects.toThrow(
        'Forbidden: You can only clone your own trips or shared trips',
      );
    });
  });

  describe('createShareSlug', () => {
    it('should create share slug for owned trip', async () => {
      const mockTrip = { id: 'trip-123', userId: 'user-123' };
      mockFindById.mockResolvedValue(mockTrip as any);
      mockUpdate.mockResolvedValue(1);

      const result = await TripService.createShareSlug('trip-123', 'user-123');

      expect(result).toHaveLength(8);
      expect(mockUpdate).toHaveBeenCalledWith(
        'trip-123',
        expect.objectContaining({ visibility: 'shared' }),
      );
    });
  });

  describe('getBudgetSummary', () => {
    it('should return budget summary for owned trip', async () => {
      const mockTrip = { id: 'trip-123', userId: 'user-123' };
      const mockSummary = {
        totalAmount: 1000,
        currency: 'UAH',
        categories: {
          transport: { amount: 500, items: 2 },
          food: { amount: 500, items: 3 },
        },
      };

      mockFindById.mockResolvedValue(mockTrip as any);
      mockGetBudgetSummary.mockResolvedValue(mockSummary);

      const result = await TripService.getBudgetSummary('trip-123', 'user-123');

      expect(result).toEqual(mockSummary);
    });
  });
});
