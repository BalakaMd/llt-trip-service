import { Router } from 'express';
import TripController from '../controllers/TripController';

const router = Router();

// Trip routes
router.post('/trips', TripController.createTrip.bind(TripController));
router.get('/trips/:id', TripController.getTrip.bind(TripController));
router.get('/users/:userId/trips', TripController.getUserTrips.bind(TripController));

// Itinerary items routes
router.post('/trips/:id/items', TripController.addItineraryItem.bind(TripController));

// Map data route
router.get('/trips/:id/map', TripController.getTripMapData.bind(TripController));

export default router;
