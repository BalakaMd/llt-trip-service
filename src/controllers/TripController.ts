import { Request, Response } from 'express';
import TripService from '../services/TripService';
import { AppError, handleError } from '../utils/errorHandler';

class TripController {
  async createTrip(req: Request, res: Response): Promise<void> {
    try {
      const { userId, title, startDate, endDate, originCity, originLat, originLng } = req.body;

      if (!title || !startDate || !endDate) {
        throw new AppError('Missing required fields: title, startDate, endDate', 400);
      }

      const trip = await TripService.createTrip({
        userId,
        title,
        startDate,
        endDate,
        originCity,
        originLat,
        originLng
      });

      res.status(201).json({
        status: 'success',
        data: { trip }
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
        data: { trip }
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
        data: { trips }
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
        throw new AppError('Missing required fields: googlePlaceId, name, location', 400);
      }

      const item = await TripService.addItineraryItem(id, itemData);

      res.status(201).json({
        status: 'success',
        data: { item }
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
        data: mapData
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new TripController();
