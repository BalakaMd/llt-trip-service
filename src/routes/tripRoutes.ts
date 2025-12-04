import { Router } from 'express';
import TripController from '../controllers/TripController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createTripSchema,
  updateTripSchema,
  addItineraryItemSchema,
  uuidParamSchema,
  userIdParamSchema
} from '../validators/tripValidators';

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
 *         description: Validation error
 */
router.post('/trips',
  validate(createTripSchema, 'body'),
  TripController.createTrip.bind(TripController)
);

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
router.get('/trips/:id',
  validate(uuidParamSchema, 'params'),
  TripController.getTrip.bind(TripController)
);

/**
 * @swagger
 * /trips/{id}:
 *   patch:
 *     summary: Update a trip
 *     tags: [Trips]
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
 *             $ref: '#/components/schemas/UpdateTripRequest'
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Trip not found
 */
router.patch('/trips/:id',
  validate(uuidParamSchema, 'params'),
  validate(updateTripSchema, 'body'),
  TripController.updateTrip.bind(TripController)
);

/**
 * @swagger
 * /trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 */
router.delete('/trips/:id',
  validate(uuidParamSchema, 'params'),
  TripController.deleteTrip.bind(TripController)
);

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
router.get('/users/:userId/trips',
  validate(userIdParamSchema, 'params'),
  TripController.getUserTrips.bind(TripController)
);

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
 *         description: Validation error
 */
router.post('/trips/:id/items',
  validate(uuidParamSchema, 'params'),
  validate(addItineraryItemSchema, 'body'),
  TripController.addItineraryItem.bind(TripController)
);

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
router.get('/trips/:id/map',
  validate(uuidParamSchema, 'params'),
  TripController.getTripMapData.bind(TripController)
);

export default router;

