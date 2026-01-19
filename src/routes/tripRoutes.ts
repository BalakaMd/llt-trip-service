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
 *     description: Creates a new trip with the provided details
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTripRequest'
 *           example:
 *             userId: "123e4567-e89b-12d3-a456-426614174000"
 *             title: "Weekend in Paris"
 *             startDate: "2024-06-01"
 *             endDate: "2024-06-03"
 *             originCity: "Kyiv"
 *             originLat: 50.4501
 *             originLng: 30.5234
 *             transportMode: "plane"
 *             totalBudgetEstimate: 800
 *             currency: "USD"
 *     responses:
 *       201:
 *         description: Trip created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     trip:
 *                       $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Retrieves detailed information about a specific trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Trip found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     trip:
 *                       $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Updates an existing trip with new information
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTripRequest'
 *           example:
 *             title: "Extended Weekend in Paris"
 *             startDate: "2024-06-01"
 *             endDate: "2024-06-05"
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     trip:
 *                       $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Permanently deletes a trip and all associated data
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Retrieves all trips belonging to a specific user
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: List of trips retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     trips:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Trip'
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
 *     description: Adds a new place or activity to the trip itinerary
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItineraryItemRequest'
 *           example:
 *             googlePlaceId: "ChIJLU7jZClu5kcR4PcOOO6p3I0"
 *             name: "Eiffel Tower"
 *             location:
 *               lat: 48.8584
 *               lng: 2.2945
 *             address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris"
 *             categories: ["tourist_attraction", "point_of_interest"]
 *             dayIndex: 0
 *             orderIndex: 1
 *             title: "Visit Eiffel Tower"
 *             description: "Iconic iron lattice tower and symbol of Paris"
 *     responses:
 *       201:
 *         description: Itinerary item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     item:
 *                       $ref: '#/components/schemas/ItineraryItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Retrieves formatted map data including markers and polylines for Google Maps integration
 *     tags: [Map]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Map data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/MapResponse'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Creates AI-powered trip recommendations based on user preferences and constraints
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendTripRequest'
 *           example:
 *             origin:
 *               city: "Kyiv"
 *               lat: 50.4501
 *               lng: 30.5234
 *             dates:
 *               start: "2024-06-01"
 *               end: "2024-06-08"
 *             budget: 2000
 *             interests: ["culture", "history", "museums"]
 *             transport: "car"
 *             timezone: "Europe/Kyiv"
 *             dryRun: false
 *     responses:
 *       200:
 *         description: Trip recommendation generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     trip:
 *                       $ref: '#/components/schemas/Trip'
 *                     mapData:
 *                       $ref: '#/components/schemas/MapResponse'
 *                   description: AI-generated trip recommendation with destinations, itinerary, and map data
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Creates a copy of an existing trip for a specified user
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Original trip UUID to clone
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CloneTripRequest'
 *           example:
 *             userId: "987fcdeb-51a2-43d1-9876-543210987654"
 *     responses:
 *       201:
 *         description: Trip cloned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     trip:
 *                       $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Original trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Generates a public share link for the trip that allows others to view it
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Share link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShareLinkResponse'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Retrieves a publicly shared trip using its share slug
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: shareSlug
 *         required: true
 *         description: Unique share slug for the trip
 *         schema:
 *           type: string
 *         example: "abc123def456"
 *     responses:
 *       200:
 *         description: Public trip retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     trip:
 *                       $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found or not shared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Updates the entire itinerary with a new set of items, replacing existing ones
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItineraryRequest'
 *           example:
 *             items:
 *               - googlePlaceId: "ChIJLU7jZClu5kcR4PcOOO6p3I0"
 *                 name: "Eiffel Tower"
 *                 location:
 *                   lat: 48.8584
 *                   lng: 2.2945
 *                 address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris"
 *                 dayIndex: 0
 *                 orderIndex: 1
 *                 title: "Visit Eiffel Tower"
 *                 description: "Morning visit to the iconic tower"
 *               - googlePlaceId: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ"
 *                 name: "Louvre Museum"
 *                 location:
 *                   lat: 48.8606
 *                   lng: 2.3376
 *                 address: "Rue de Rivoli, 75001 Paris"
 *                 dayIndex: 0
 *                 orderIndex: 2
 *                 title: "Explore Louvre Museum"
 *                 description: "Afternoon at the world's largest art museum"
 *     responses:
 *       200:
 *         description: Itinerary updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ItineraryItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Updates details of a single itinerary item within a trip
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: Itinerary item UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "987fcdeb-51a2-43d1-9876-543210987654"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Extended Louvre Visit"
 *               description:
 *                 type: string
 *                 example: "Spend more time exploring the Egyptian collection"
 *               dayIndex:
 *                 type: integer
 *                 example: 1
 *               orderIndex:
 *                 type: integer
 *                 example: 3
 *           example:
 *             title: "Extended Louvre Visit"
 *             description: "Spend more time exploring the Egyptian collection"
 *             dayIndex: 1
 *             orderIndex: 1
 *     responses:
 *       200:
 *         description: Itinerary item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     item:
 *                       $ref: '#/components/schemas/ItineraryItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Trip or itinerary item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Adds a new expense or budget allocation to the trip
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BudgetItemRequest'
 *           example:
 *             category: "accommodation"
 *             subcategory: "hotel"
 *             amount: 450.00
 *             currency: "USD"
 *             description: "3 nights at Hotel de Paris"
 *             date: "2024-06-01"
 *     responses:
 *       201:
 *         description: Budget item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     budgetItem:
 *                       $ref: '#/components/schemas/BudgetItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Updates an existing budget item with new information
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: bid
 *         required: true
 *         description: Budget item UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "987fcdeb-51a2-43d1-9876-543210987654"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBudgetItemRequest'
 *           example:
 *             amount: 95.75
 *             description: "Updated dinner cost with tip"
 *     responses:
 *       200:
 *         description: Budget item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     budgetItem:
 *                       $ref: '#/components/schemas/BudgetItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Trip or budget item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: Retrieves a comprehensive budget overview including totals by category
 *     tags: [Budget]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Budget summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/BudgetSummary'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/trips/:id/budget/summary',
  validate(uuidParamSchema, 'params'),
  TripController.getBudgetSummary.bind(TripController),
);

export default router;
