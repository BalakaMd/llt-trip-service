import Trip from './Trip';
import Place from './Place';
import ItineraryItem from './ItineraryItem';

// Define model associations
Trip.hasMany(ItineraryItem, {
  foreignKey: 'tripId',
  as: 'itineraryItems'
});

ItineraryItem.belongsTo(Trip, {
  foreignKey: 'tripId',
  as: 'trip'
});

Place.hasMany(ItineraryItem, {
  foreignKey: 'placeId',
  as: 'itineraryItems'
});

ItineraryItem.belongsTo(Place, {
  foreignKey: 'placeId',
  as: 'place'
});

export { Trip, Place, ItineraryItem };
