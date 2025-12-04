import { Router } from 'express';
import TripController from '../controllers/TripController';

const router = Router();

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTripRequest'
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/trips', TripController.createTrip.bind(TripController));

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Trip found
 *       404:
 *         description: Trip not found
 */
router.get('/trips/:id', TripController.getTrip.bind(TripController));

/**
 * @swagger
 * /users/{userId}/trips:
 *   get:
 *     summary: Get all trips for a user
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of trips
 */
router.get('/users/:userId/trips', TripController.getUserTrips.bind(TripController));

/**
 * @swagger
 * /trips/{id}/items:
 *   post:
 *     summary: Add an itinerary item to a trip
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItineraryItemRequest'
 *     responses:
 *       201:
 *         description: Item added successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/trips/:id/items', TripController.addItineraryItem.bind(TripController));

/**
 * @swagger
 * /trips/{id}/map:
 *   get:
 *     summary: Get map data for a trip
 *     tags: [Map]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Map data for Google Maps Advanced Markers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MapResponse'
 */
router.get('/trips/:id/map', TripController.getTripMapData.bind(TripController));

export default router;
