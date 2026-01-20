import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LittleLifeTrip Trips Service API',
      version: '1.0.0',
      description: `
        A comprehensive microservice for managing trips as part of the LittleLifeTrip platform.
        
        ## Features
        - **Trip Management**: Create, read, update, and delete trips
        - **Itinerary Planning**: Add and manage places and activities
        - **Budget Tracking**: Monitor expenses and budget allocations
        - **Map Integration**: Get formatted data for Google Maps
        - **Trip Sharing**: Generate public share links
        - **AI Recommendations**: Get personalized trip suggestions
        
        ## Authentication
        This service requires user context headers for all protected endpoints:
        - **x-user-id**: User ID (UUID) - REQUIRED for all POST/PUT/DELETE operations
        - **x-user-email**: User email address (optional)
        - **x-user-roles**: User roles (optional, comma-separated)
        
        Example headers for testing:
        \`\`\`
        x-user-id: 123e4567-e89b-12d3-a456-426614174000
        x-user-email: test@example.com
        x-user-roles: user
        \`\`\`
        
        ## Error Handling
        All endpoints return consistent error responses with status codes and descriptive messages.
      `,
      contact: {
        name: 'LittleLifeTrip Support',
        email: 'support@littlelifetrip.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development API v1',
      },
      {
        url: 'https://api.littlelifetrip.com/api/v1',
        description: 'Production API v1',
      },
    ],
    tags: [
      {
        name: 'Trips',
        description: 'Trip management operations',
      },
      {
        name: 'Itinerary',
        description: 'Itinerary and activity management',
      },
      {
        name: 'Budget',
        description: 'Budget and expense tracking',
      },
      {
        name: 'Map',
        description: 'Map data and visualization',
      },
      {
        name: 'Public',
        description: 'Public access endpoints',
      },
    ],
    components: {
      securitySchemes: {
        UserContext: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-id',
          description: 'User ID (UUID) - Required for all protected endpoints',
        },
        UserEmail: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-email',
          description: 'User email address (optional)',
        },
        UserRoles: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-roles',
          description: 'User roles (optional, comma-separated)',
        },
      },
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
            visibility: {
              type: 'string',
              enum: ['private', 'public', 'shared'],
            },
            shareSlug: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTripRequest: {
          type: 'object',
          required: ['title', 'startDate', 'endDate'],
          properties: {
            title: { type: 'string', example: 'Weekend in Paris' },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-06-01',
            },
            endDate: { type: 'string', format: 'date', example: '2024-06-03' },
            originCity: { type: 'string', example: 'Kyiv' },
            originLat: { type: 'number', example: 50.4501 },
            originLng: { type: 'number', example: 30.5234 },
            transportMode: { type: 'string', example: 'plane' },
            totalBudgetEstimate: { type: 'number', example: 800 },
            currency: { type: 'string', example: 'USD' },
          },
        },
        UpdateTripRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Updated Trip Title' },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-06-01',
            },
            endDate: { type: 'string', format: 'date', example: '2024-06-05' },
            originCity: { type: 'string', example: 'Lviv' },
            originLat: { type: 'number', example: 49.8397 },
            originLng: { type: 'number', example: 24.0297 },
          },
        },
        AddItineraryItemRequest: {
          type: 'object',
          required: [
            'googlePlaceId',
            'name',
            'location',
            'dayIndex',
            'orderIndex',
          ],
          properties: {
            googlePlaceId: {
              type: 'string',
              example: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
            },
            name: { type: 'string', example: 'Eiffel Tower' },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number', example: 48.8584 },
                lng: { type: 'number', example: 2.2945 },
              },
            },
            address: {
              type: 'string',
              example: 'Champ de Mars, 5 Av. Anatole France',
            },
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
            markers: {
              type: 'array',
              items: { $ref: '#/components/schemas/MapMarker' },
            },
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
        RecommendTripRequest: {
          type: 'object',
          required: ['origin', 'dates', 'budget', 'interests', 'transport'],
          properties: {
            origin: {
              type: 'object',
              required: ['city'],
              properties: {
                city: { type: 'string', example: 'Kyiv' },
                lat: { type: 'number', example: 50.4501 },
                lng: { type: 'number', example: 30.5234 },
              },
            },
            dates: {
              type: 'object',
              required: ['start', 'end'],
              properties: {
                start: {
                  type: 'string',
                  format: 'date',
                  example: '2024-06-01',
                },
                end: { type: 'string', format: 'date', example: '2024-06-08' },
              },
            },
            budget: { type: 'number', example: 2000 },
            interests: {
              type: 'array',
              items: { type: 'string' },
              example: ['culture', 'history', 'museums'],
            },
            transport: {
              type: 'string',
              enum: ['car', 'public', 'bike', 'walk'],
              example: 'car',
            },
            timezone: { type: 'string', example: 'Europe/Kyiv' },
            dryRun: { type: 'boolean', example: false },
            currency: {
              type: 'string',
              length: 3,
              example: 'UAH',
              default: 'UAH',
            },
            language: {
              type: 'string',
              example: 'Ukrainian',
              default: 'Ukrainian',
            },
          },
        },
        CloneTripRequest: {
          type: 'object',
          properties: {},
        },
        BudgetItemRequest: {
          type: 'object',
          required: ['category', 'amount', 'currency'],
          properties: {
            category: { type: 'string', example: 'accommodation' },
            subcategory: { type: 'string', example: 'hotel' },
            amount: { type: 'number', example: 150.5 },
            currency: { type: 'string', example: 'USD' },
            description: {
              type: 'string',
              example: 'Hotel booking for 2 nights',
            },
            date: { type: 'string', format: 'date', example: '2024-06-01' },
          },
        },
        UpdateBudgetItemRequest: {
          type: 'object',
          properties: {
            category: { type: 'string', example: 'food' },
            subcategory: { type: 'string', example: 'restaurant' },
            amount: { type: 'number', example: 75.25 },
            currency: { type: 'string', example: 'EUR' },
            description: {
              type: 'string',
              example: 'Dinner at local restaurant',
            },
            date: { type: 'string', format: 'date', example: '2024-06-02' },
          },
        },
        UpdateItineraryRequest: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  googlePlaceId: {
                    type: 'string',
                    example: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
                  },
                  name: { type: 'string', example: 'Louvre Museum' },
                  location: {
                    type: 'object',
                    properties: {
                      lat: { type: 'number', example: 48.8606 },
                      lng: { type: 'number', example: 2.3376 },
                    },
                  },
                  address: {
                    type: 'string',
                    example: 'Rue de Rivoli, 75001 Paris',
                  },
                  dayIndex: { type: 'integer', example: 1 },
                  orderIndex: { type: 'integer', example: 2 },
                  title: { type: 'string', example: 'Visit Louvre Museum' },
                  description: {
                    type: 'string',
                    example: 'Explore world-famous art collection',
                  },
                },
              },
            },
          },
        },
        ItineraryItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            tripId: { type: 'string', format: 'uuid' },
            googlePlaceId: { type: 'string' },
            name: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number' },
                lng: { type: 'number' },
              },
            },
            address: { type: 'string' },
            categories: { type: 'array', items: { type: 'string' } },
            dayIndex: { type: 'integer' },
            orderIndex: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        BudgetItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            tripId: { type: 'string', format: 'uuid' },
            category: { type: 'string' },
            subcategory: { type: 'string' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        BudgetSummary: {
          type: 'object',
          properties: {
            totalBudget: { type: 'number', example: 1500 },
            totalSpent: { type: 'number', example: 850.75 },
            remaining: { type: 'number', example: 649.25 },
            currency: { type: 'string', example: 'USD' },
            categories: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  budgeted: { type: 'number' },
                  spent: { type: 'number' },
                  remaining: { type: 'number' },
                },
              },
              example: {
                accommodation: { budgeted: 600, spent: 450, remaining: 150 },
                food: { budgeted: 400, spent: 250.75, remaining: 149.25 },
                transport: { budgeted: 300, spent: 150, remaining: 150 },
              },
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: { type: 'object' },
          },
        },
        ShareLinkResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                shareSlug: { type: 'string', example: 'abc123def456' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Trip not found' },
            code: { type: 'integer', example: 404 },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
