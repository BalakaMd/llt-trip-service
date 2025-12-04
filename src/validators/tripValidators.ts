import Joi from 'joi';

export const createTripSchema = Joi.object({
  userId: Joi.string().uuid().optional(),
  title: Joi.string().min(1).max(255).required()
    .messages({
      'string.empty': 'Title is required',
      'string.max': 'Title must be at most 255 characters'
    }),
  startDate: Joi.date().iso().required()
    .messages({
      'date.format': 'Start date must be a valid ISO date (YYYY-MM-DD)'
    }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
    .messages({
      'date.min': 'End date must be after or equal to start date',
      'date.format': 'End date must be a valid ISO date (YYYY-MM-DD)'
    }),
  originCity: Joi.string().max(255).optional(),
  originLat: Joi.number().min(-90).max(90).optional()
    .messages({
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90'
    }),
  originLng: Joi.number().min(-180).max(180).optional()
    .messages({
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180'
    })
});

export const updateTripSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  originCity: Joi.string().max(255).optional().allow(null),
  originLat: Joi.number().min(-90).max(90).optional().allow(null),
  originLng: Joi.number().min(-180).max(180).optional().allow(null)
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const addItineraryItemSchema = Joi.object({
  googlePlaceId: Joi.string().required()
    .messages({
      'string.empty': 'Google Place ID is required'
    }),
  name: Joi.string().min(1).max(255).required()
    .messages({
      'string.empty': 'Name is required'
    }),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).required()
    .messages({
      'object.base': 'Location with lat and lng is required'
    }),
  address: Joi.string().optional(),
  categories: Joi.array().items(Joi.string()).optional(),
  dayIndex: Joi.number().integer().min(0).required()
    .messages({
      'number.min': 'Day index must be 0 or greater'
    }),
  orderIndex: Joi.number().integer().min(0).required()
    .messages({
      'number.min': 'Order index must be 0 or greater'
    }),
  title: Joi.string().max(255).optional(),
  description: Joi.string().optional()
});

export const uuidParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .messages({
      'string.guid': 'ID must be a valid UUID'
    })
});

export const userIdParamSchema = Joi.object({
  userId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'User ID must be a valid UUID'
    })
});
