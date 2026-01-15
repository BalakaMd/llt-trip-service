import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RouteCacheAttributes {
  tripId: string;
  provider: 'google';
  requestSig: string;
  encodedPolyline: string;
  bounds: object;
  legs: object[];
  distanceM: number;
  durationS: number;
  fetchedAt: Date;
}

interface RouteCacheCreationAttributes
  extends Optional<RouteCacheAttributes, never> {}

class RouteCache
  extends Model<RouteCacheAttributes, RouteCacheCreationAttributes>
  implements RouteCacheAttributes
{
  public tripId!: string;
  public provider!: 'google';
  public requestSig!: string;
  public encodedPolyline!: string;
  public bounds!: object;
  public legs!: object[];
  public distanceM!: number;
  public durationS!: number;
  public fetchedAt!: Date;
}

RouteCache.init(
  {
    tripId: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: 'trip_id',
      references: {
        model: 'trips',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    provider: {
      type: DataTypes.ENUM('google'),
      allowNull: false,
      defaultValue: 'google',
    },
    requestSig: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: 'request_sig',
    },
    encodedPolyline: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'encoded_polyline',
    },
    bounds: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    legs: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    distanceM: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'distance_m',
    },
    durationS: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'duration_s',
    },
    fetchedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fetched_at',
    },
  },
  {
    sequelize,
    tableName: 'route_cache',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['request_sig'],
      },
    ],
  },
);

export default RouteCache;
