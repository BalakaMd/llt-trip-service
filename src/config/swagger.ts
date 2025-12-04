import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trip Service API',
      version: '1.0.0',
      description: 'A microservice for managing trips as part of the TravelFinder platform',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      schemas: {
        Trip: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid', nullable: true },
            title: { type: 'string' },
            summary: { type: 'string', nullable: true },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            originCity: { type: 'string', nullable: true },
            originLat: { type: 'number', nullable: true },
            originLng: { type: 'number', nullable: true },
            status: { type: 'string', enum: ['draft', 'final'] },
            visibility: { type: 'string', enum: ['private', 'public', 'shared'] },
            shareSlug: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTripRequest: {
          type: 'object',
          required: ['title', 'startDate', 'endDate'],
          properties: {
            userId: { type: 'string', format: 'uuid' },
            title: { type: 'string', example: 'Weekend in Paris' },
            startDate: { type: 'string', format: 'date', example: '2024-06-01' },
            endDate: { type: 'string', format: 'date', example: '2024-06-03' },
            originCity: { type: 'string', example: 'Kyiv' },
            originLat: { type: 'number', example: 50.4501 },
            originLng: { type: 'number', example: 30.5234 },
          },
        },
        AddItineraryItemRequest: {
          type: 'object',
          required: ['googlePlaceId', 'name', 'location', 'dayIndex', 'orderIndex'],
          properties: {
            googlePlaceId: { type: 'string', example: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ' },
            name: { type: 'string', example: 'Eiffel Tower' },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number', example: 48.8584 },
                lng: { type: 'number', example: 2.2945 },
              },
            },
            address: { type: 'string', example: 'Champ de Mars, 5 Av. Anatole France' },
            categories: { type: 'array', items: { type: 'string' } },
            dayIndex: { type: 'integer', example: 0 },
            orderIndex: { type: 'integer', example: 1 },
            title: { type: 'string' },
            description: { type: 'string' },
          },
        },
        MapMarker: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            position: {
              type: 'object',
              properties: {
                lat: { type: 'number' },
                lng: { type: 'number' },
              },
            },
            title: { type: 'string' },
            mapPinConfig: {
              type: 'object',
              properties: {
                glyph: { type: 'string' },
                background: { type: 'string' },
                borderColor: { type: 'string' },
              },
            },
            infoWindowContent: {
              type: 'object',
              properties: {
                address: { type: 'string' },
                dayIndex: { type: 'integer' },
                orderIndex: { type: 'integer' },
              },
            },
          },
        },
        MapResponse: {
          type: 'object',
          properties: {
            tripId: { type: 'string', format: 'uuid' },
            polyline: { type: 'string', nullable: true },
            markers: { type: 'array', items: { $ref: '#/components/schemas/MapMarker' } },
            bounds: {
              type: 'object',
              properties: {
                north: { type: 'number' },
                south: { type: 'number' },
                east: { type: 'number' },
                west: { type: 'number' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
