import { Router } from 'express';
import TripController from '../controllers/TripController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createTripSchema,
  updateTripSchema,
  addItineraryItemSchema,
  uuidParamSchema,
  userIdParamSchema,
  recommendTripSchema,
  budgetItemSchema,
  updateBudgetItemSchema,
  updateItinerarySchema,
  shareSlugParamSchema,
  budgetItemParamSchema,
  itineraryItemParamSchema,
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
router.post(
  '/trips',
  validate(createTripSchema, 'body'),
  TripController.createTrip.bind(TripController),
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
router.get(
  '/trips/:id',
  validate(uuidParamSchema, 'params'),
  TripController.getTrip.bind(TripController),
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
router.patch(
  '/trips/:id',
  validate(uuidParamSchema, 'params'),
  validate(updateTripSchema, 'body'),
  TripController.updateTrip.bind(TripController),
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
router.delete(
  '/trips/:id',
  validate(uuidParamSchema, 'params'),
  TripController.deleteTrip.bind(TripController),
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
router.get(
  '/users/:userId/trips',
  validate(userIdParamSchema, 'params'),
  TripController.getUserTrips.bind(TripController),
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
router.post(
  '/trips/:id/items',
  validate(uuidParamSchema, 'params'),
  validate(addItineraryItemSchema, 'body'),
  TripController.addItineraryItem.bind(TripController),
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
router.get(
  '/trips/:id/map',
  validate(uuidParamSchema, 'params'),
  TripController.getTripMapData.bind(TripController),
);

/**
 * @swagger
 * /trips/recommend:
 *   post:
 *     summary: Generate a trip recommendation
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendTripRequest'
 *     responses:
 *       200:
 *         description: Trip recommendation generated
 */
router.post(
  '/trips/recommend',
  validate(recommendTripSchema, 'body'),
  TripController.recommendTrip.bind(TripController),
);

/**
 * @swagger
 * /trips/{id}/clone:
 *   post:
 *     summary: Clone a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Trip cloned successfully
 */
router.post(
  '/trips/:id/clone',
  validate(uuidParamSchema, 'params'),
  TripController.cloneTrip.bind(TripController),
);

/**
 * @swagger
 * /trips/{id}/share:
 *   post:
 *     summary: Create a share link for a trip
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
 *         description: Share link created
 */
router.post(
  '/trips/:id/share',
  validate(uuidParamSchema, 'params'),
  TripController.createShareLink.bind(TripController),
);

/**
 * @swagger
 * /public/trips/{shareSlug}:
 *   get:
 *     summary: Get a public trip by share slug
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: shareSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public trip found
 *       404:
 *         description: Trip not found or not shared
 */
router.get(
  '/public/trips/:shareSlug',
  validate(shareSlugParamSchema, 'params'),
  TripController.getPublicTrip.bind(TripController),
);

/**
 * @swagger
 * /trips/{id}/itinerary:
 *   post:
 *     summary: Update trip itinerary
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
 *             $ref: '#/components/schemas/UpdateItineraryRequest'
 *     responses:
 *       200:
 *         description: Itinerary updated successfully
 */
router.post(
  '/trips/:id/itinerary',
  validate(uuidParamSchema, 'params'),
  validate(updateItinerarySchema, 'body'),
  TripController.updateItinerary.bind(TripController),
);

/**
 * @swagger
 * /trips/{id}/itinerary/{itemId}:
 *   patch:
 *     summary: Update a specific itinerary item
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Itinerary item updated successfully
 */
router.patch(
  '/trips/:id/itinerary/:itemId',
  validate(itineraryItemParamSchema, 'params'),
  TripController.updateItineraryItem.bind(TripController),
);

/**
 * @swagger
 * /trips/{id}/budget/items:
 *   post:
 *     summary: Add a budget item to a trip
 *     tags: [Budget]
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
 *             $ref: '#/components/schemas/BudgetItemRequest'
 *     responses:
 *       201:
 *         description: Budget item added successfully
 */
router.post(
  '/trips/:id/budget/items',
  validate(uuidParamSchema, 'params'),
  validate(budgetItemSchema, 'body'),
  TripController.addBudgetItem.bind(TripController),
);

/**
 * @swagger
 * /trips/{id}/budget/items/{bid}:
 *   patch:
 *     summary: Update a budget item
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBudgetItemRequest'
 *     responses:
 *       200:
 *         description: Budget item updated successfully
 */
router.patch(
  '/trips/:id/budget/items/:bid',
  validate(budgetItemParamSchema, 'params'),
  validate(updateBudgetItemSchema, 'body'),
  TripController.updateBudgetItem.bind(TripController),
);

/**
 * @swagger
 * /trips/{id}/budget/summary:
 *   get:
 *     summary: Get budget summary for a trip
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Budget summary retrieved
 */
router.get(
  '/trips/:id/budget/summary',
  validate(uuidParamSchema, 'params'),
  TripController.getBudgetSummary.bind(TripController),
);

export default router;
