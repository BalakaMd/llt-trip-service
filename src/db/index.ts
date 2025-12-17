import type { Sequelize } from "sequelize";
import { Trip } from "./models/trip";
import { Place } from "./models/place";
import { ItineraryItem } from "./models/itinerary-item";

export function initModels(sequelize: Sequelize) {
  Trip.initModel(sequelize);
  Place.initModel(sequelize);
  ItineraryItem.initModel(sequelize);

  // Associations
  Trip.hasMany(ItineraryItem, { foreignKey: "trip_id", as: "items" });
  ItineraryItem.belongsTo(Trip, { foreignKey: "trip_id", as: "trip" });

  Place.hasMany(ItineraryItem, { foreignKey: "place_id", as: "items" });
  ItineraryItem.belongsTo(Place, { foreignKey: "place_id", as: "place" });

  return { Trip, Place, ItineraryItem };
}