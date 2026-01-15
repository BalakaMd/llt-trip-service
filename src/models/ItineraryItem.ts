import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ItineraryItemAttributes {
  id: string;
  tripId: string;
  placeId: string | null;
  dayIndex: number;
  orderIndex: number;
  title: string | null;
  description: string | null;
  plannedStartAt: Date | null;
  plannedEndAt: Date | null;
  transportSegment: object | null;
  costEstimate: number | null;
  snapshotLat: number;
  snapshotLng: number;
  snapshotPlaceName: string | null;
  snapshotAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ItineraryItemCreationAttributes
  extends Optional<
    ItineraryItemAttributes,
    | 'id'
    | 'placeId'
    | 'title'
    | 'description'
    | 'plannedStartAt'
    | 'plannedEndAt'
    | 'transportSegment'
    | 'costEstimate'
    | 'snapshotPlaceName'
    | 'snapshotAddress'
    | 'createdAt'
    | 'updatedAt'
  > {}

class ItineraryItem
  extends Model<ItineraryItemAttributes, ItineraryItemCreationAttributes>
  implements ItineraryItemAttributes
{
  public id!: string;
  public tripId!: string;
  public placeId!: string | null;
  public dayIndex!: number;
  public orderIndex!: number;
  public title!: string | null;
  public description!: string | null;
  public plannedStartAt!: Date | null;
  public plannedEndAt!: Date | null;
  public transportSegment!: object | null;
  public costEstimate!: number | null;
  // Snapshot pattern - local copy of location data
  public snapshotLat!: number;
  public snapshotLng!: number;
  public snapshotPlaceName!: string | null;
  public snapshotAddress!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ItineraryItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tripId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'trip_id',
      references: {
        model: 'trips',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    placeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'place_id',
      references: {
        model: 'places',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    dayIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'day_index',
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'order_index',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    snapshotLat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      field: 'snapshot_lat',
    },
    snapshotLng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      field: 'snapshot_lng',
    },
    snapshotAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'snapshot_address',
    },
    plannedStartAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'planned_start_at',
    },
    plannedEndAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'planned_end_at',
    },
    transportSegment: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'transport_segment',
    },
    costEstimate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'cost_estimate',
    },
    snapshotPlaceName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'snapshot_place_name',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'itinerary_items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['trip_id', 'day_index', 'order_index'],
      },
    ],
  },
);

export default ItineraryItem;
