import Joi from 'joi';

export const createTripSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must be at most 255 characters',
  }),
  startDate: Joi.date().iso().required().messages({
    'date.format': 'Start date must be a valid ISO date (YYYY-MM-DD)',
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
    'date.min': 'End date must be after or equal to start date',
    'date.format': 'End date must be a valid ISO date (YYYY-MM-DD)',
  }),
  originCity: Joi.string().max(255).optional(),
  originLat: Joi.number().min(-90).max(90).optional().messages({
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
  }),
  originLng: Joi.number().min(-180).max(180).optional().messages({
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
  }),
  transportMode: Joi.string()
    .valid('car', 'plane', 'train', 'bus', 'public', 'bike', 'walk')
    .optional(),
  totalBudgetEstimate: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).optional().default('USD').messages({
    'string.length': 'Currency must be a 3-character code (e.g., USD, EUR)',
  }),
});

export const updateTripSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  originCity: Joi.string().max(255).optional().allow(null),
  originLat: Joi.number().min(-90).max(90).optional().allow(null),
  originLng: Joi.number().min(-180).max(180).optional().allow(null),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

export const addItineraryItemSchema = Joi.object({
  googlePlaceId: Joi.string().required().messages({
    'string.empty': 'Google Place ID is required',
  }),
  name: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'Name is required',
  }),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  })
    .required()
    .messages({
      'object.base': 'Location with lat and lng is required',
    }),
  address: Joi.string().optional(),
  categories: Joi.array().items(Joi.string()).optional(),
  dayIndex: Joi.number().integer().min(0).required().messages({
    'number.min': 'Day index must be 0 or greater',
  }),
  orderIndex: Joi.number().integer().min(0).required().messages({
    'number.min': 'Order index must be 0 or greater',
  }),
  title: Joi.string().max(255).optional(),
  description: Joi.string().optional(),
});

export const uuidParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'ID must be a valid UUID',
  }),
});

export const userIdParamSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.guid': 'User ID must be a valid UUID',
  }),
});

export const recommendTripSchema = Joi.object({
  origin: Joi.object({
    city: Joi.string().required(),
    lat: Joi.number().min(-90).max(90).optional(),
    lng: Joi.number().min(-180).max(180).optional(),
  }).required(),
  dates: Joi.object({
    start: Joi.date().iso().required(),
    end: Joi.date().iso().min(Joi.ref('start')).required(),
  }).required(),
  budget: Joi.number().min(0).required(),
  interests: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one interest must be specified',
  }),
  transport: Joi.string().valid('car', 'public', 'bike', 'walk').required(),
  timezone: Joi.string().optional(),
  dryRun: Joi.boolean().optional().default(false),
  currency: Joi.string().length(3).optional().default('UAH').messages({
    'string.length': 'Currency must be a 3-character code (e.g., USD, EUR)',
  }),
  language: Joi.string().optional().default('Ukrainian').messages({
    'string.base': 'Language must be a string',
  }),
});

export const budgetItemSchema = Joi.object({
  category: Joi.string()
    .valid('transport', 'stay', 'food', 'activities', 'other')
    .required(),
  title: Joi.string().min(1).max(255).required(),
  quantity: Joi.number().integer().min(1).required().default(1),
  unitPrice: Joi.number().min(0).required(),
  currency: Joi.string().length(3).required().default('UAH'),
  source: Joi.string().valid('ai', 'user', 'integration').required(),
  linkedItineraryItemId: Joi.string().uuid().optional(),
});

export const updateBudgetItemSchema = Joi.object({
  category: Joi.string()
    .valid('transport', 'stay', 'food', 'activities', 'other')
    .optional(),
  title: Joi.string().min(1).max(255).optional(),
  quantity: Joi.number().integer().min(1).optional(),
  unitPrice: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).optional(),
  source: Joi.string().valid('ai', 'user', 'integration').optional(),
  linkedItineraryItemId: Joi.string().uuid().optional().allow(null),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

export const updateItinerarySchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        placeId: Joi.string().uuid().optional(),
        dayIndex: Joi.number().integer().min(0).required(),
        orderIndex: Joi.number().integer().min(0).required(),
        title: Joi.string().max(255).optional(),
        description: Joi.string().optional(),
        plannedStartAt: Joi.date().iso().optional(),
        plannedEndAt: Joi.date().iso().optional(),
        transportSegment: Joi.object().optional(),
        costEstimate: Joi.number().min(0).optional(),
        snapshotLat: Joi.number().min(-90).max(90).required(),
        snapshotLng: Joi.number().min(-180).max(180).required(),
        snapshotPlaceName: Joi.string().optional(),
        snapshotAddress: Joi.string().optional(),
      }),
    )
    .required(),
});

export const shareSlugParamSchema = Joi.object({
  shareSlug: Joi.string().alphanum().length(8).required().messages({
    'string.length': 'Share slug must be 8 characters long',
    'string.alphanum': 'Share slug must contain only letters and numbers',
  }),
});

export const budgetItemParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
  bid: Joi.string().uuid().required(),
});

export const itineraryItemParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
  itemId: Joi.string().uuid().required(),
});
