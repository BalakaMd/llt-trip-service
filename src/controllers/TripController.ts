import { Request, Response } from 'express';
import TripService from '../services/TripService';
import { AppError, handleError } from '../utils/errorHandler';

class TripController {
  async createTrip(req: Request, res: Response): Promise<void> {
    try {
      const {
        userId,
        title,
        startDate,
        endDate,
        originCity,
        originLat,
        originLng,
        transportMode,
        totalBudgetEstimate,
        currency,
      } = req.body;

      const trip = await TripService.createTrip({
        userId,
        title,
        startDate,
        endDate,
        originCity,
        originLat,
        originLng,
        transportMode,
        totalBudgetEstimate,
        currency,
      });

      res.status(201).json({
        status: 'success',
        data: { trip },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getTrip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const trip = await TripService.getTripById(id);

      if (!trip) {
        throw new AppError('Trip not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: { trip },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getUserTrips(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const trips = await TripService.getUserTrips(userId);

      res.status(200).json({
        status: 'success',
        data: { trips },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async deleteTrip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await TripService.deleteTrip(id);

      if (!deleted) {
        throw new AppError('Trip not found', 404);
      }

      res.status(204).send();
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateTrip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const trip = await TripService.updateTrip(id, updateData);

      if (!trip) {
        throw new AppError('Trip not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: { trip },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async addItineraryItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const itemData = req.body;

      if (!itemData.googlePlaceId || !itemData.name || !itemData.location) {
        throw new AppError(
          'Missing required fields: googlePlaceId, name, location',
          400,
        );
      }

      const item = await TripService.addItineraryItem(id, itemData);

      res.status(201).json({
        status: 'success',
        data: { item },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getTripMapData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const mapData = await TripService.getTripMapData(id);

      res.status(200).json({
        status: 'success',
        data: mapData,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async recommendTrip(req: Request, res: Response): Promise<void> {
    try {
      const recommendData = req.body;

      const result = await TripService.recommendTrip(recommendData);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async cloneTrip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const clonedTrip = await TripService.cloneTrip(id, userId);

      res.status(201).json({
        status: 'success',
        data: { trip: clonedTrip },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async createShareLink(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const shareSlug = await TripService.createShareSlug(id);

      res.status(200).json({
        status: 'success',
        data: { shareSlug },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getPublicTrip(req: Request, res: Response): Promise<void> {
    try {
      const { shareSlug } = req.params;

      const trip = await TripService.getTripByShareSlug(shareSlug);

      if (!trip) {
        throw new AppError('Trip not found or not shared', 404);
      }

      res.status(200).json({
        status: 'success',
        data: { trip },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async addBudgetItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const budgetData = req.body;

      const budgetItem = await TripService.addBudgetItem(id, budgetData);

      res.status(201).json({
        status: 'success',
        data: { budgetItem },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateBudgetItem(req: Request, res: Response): Promise<void> {
    try {
      const { bid } = req.params;
      const updateData = req.body;

      const budgetItem = await TripService.updateBudgetItem(bid, updateData);

      if (!budgetItem) {
        throw new AppError('Budget item not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: { budgetItem },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getBudgetSummary(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const summary = await TripService.getBudgetSummary(id);

      res.status(200).json({
        status: 'success',
        data: summary,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateItinerary(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { items } = req.body;

      const updatedItems = await TripService.updateItinerary(id, items);

      res.status(200).json({
        status: 'success',
        data: { items: updatedItems },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateItineraryItem(req: Request, res: Response): Promise<void> {
    try {
      const { id, itemId } = req.params;
      const updateData = req.body;

      const item = await TripService.updateItineraryItem(
        id,
        itemId,
        updateData,
      );

      if (!item) {
        throw new AppError('Itinerary item not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: { item },
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new TripController();
