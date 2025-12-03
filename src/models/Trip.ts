import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TripAttributes {
  id: string;
  userId: string | null;
  title: string;
  summary: string | null;
  startDate: Date;
  endDate: Date;
  originCity: string | null;
  originLat: number | null;
  originLng: number | null;
  status: 'draft' | 'final';
  visibility: 'private' | 'public' | 'shared';
  shareSlug: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TripCreationAttributes extends Optional<TripAttributes, 'id' | 'userId' | 'summary' | 'originCity' | 'originLat' | 'originLng' | 'status' | 'visibility' | 'shareSlug' | 'createdAt' | 'updatedAt'> {}

class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
  public id!: string;
  public userId!: string | null;
  public title!: string;
  public summary!: string | null;
  public startDate!: Date;
  public endDate!: Date;
  public originCity!: string | null;
  public originLat!: number | null;
  public originLng!: number | null;
  public status!: 'draft' | 'final';
  public visibility!: 'private' | 'public' | 'shared';
  public shareSlug!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Trip.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'end_date'
    },
    originCity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'origin_city'
    },
    originLat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      field: 'origin_lat'
    },
    originLng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      field: 'origin_lng'
    },
    status: {
      type: DataTypes.ENUM('draft', 'final'),
      defaultValue: 'draft'
    },
    visibility: {
      type: DataTypes.ENUM('private', 'public', 'shared'),
      defaultValue: 'private'
    },
    shareSlug: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      field: 'share_slug'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  },
  {
    sequelize,
    tableName: 'trips',
    schema: 'trip',
    timestamps: true,
    underscored: true
  }
);

export default Trip;
