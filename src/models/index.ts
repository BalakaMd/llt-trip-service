import Trip from './Trip';
import Place from './Place';
import ItineraryItem from './ItineraryItem';
import BudgetItem from './BudgetItem';
import RouteCache from './RouteCache';

// Define model associations
Trip.hasMany(ItineraryItem, {
  foreignKey: 'tripId',
  as: 'itineraryItems',
});

ItineraryItem.belongsTo(Trip, {
  foreignKey: 'tripId',
  as: 'trip',
});

Trip.hasMany(BudgetItem, {
  foreignKey: 'tripId',
  as: 'budgetItems',
});

BudgetItem.belongsTo(Trip, {
  foreignKey: 'tripId',
  as: 'trip',
});

Trip.hasOne(RouteCache, {
  foreignKey: 'tripId',
  as: 'routeCache',
});

RouteCache.belongsTo(Trip, {
  foreignKey: 'tripId',
  as: 'trip',
});

Place.hasMany(ItineraryItem, {
  foreignKey: 'placeId',
  as: 'itineraryItems',
});

ItineraryItem.belongsTo(Place, {
  foreignKey: 'placeId',
  as: 'place',
});

BudgetItem.belongsTo(ItineraryItem, {
  foreignKey: 'linkedItineraryItemId',
  as: 'linkedItineraryItem',
});

ItineraryItem.hasMany(BudgetItem, {
  foreignKey: 'linkedItineraryItemId',
  as: 'budgetItems',
});

export { Trip, Place, ItineraryItem, BudgetItem, RouteCache };
