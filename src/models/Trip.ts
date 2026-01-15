import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TripAttributes {
  id: string;
  userId: string | null;
  title: string;
  summary: string | null;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  originCity: string | null;
  originLat: number | null;
  originLng: number | null;
  transportMode: 'car' | 'public' | 'bike' | 'walk';
  totalBudgetEstimate: number | null;
  currency: string;
  status: 'draft' | 'final';
  visibility: 'private' | 'unlisted' | 'public';
  shareSlug: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TripCreationAttributes
  extends Optional<
    TripAttributes,
    | 'id'
    | 'userId'
    | 'summary'
    | 'originCity'
    | 'originLat'
    | 'originLng'
    | 'totalBudgetEstimate'
    | 'currency'
    | 'status'
    | 'visibility'
    | 'shareSlug'
    | 'createdAt'
    | 'updatedAt'
  > {}

class Trip
  extends Model<TripAttributes, TripCreationAttributes>
  implements TripAttributes
{
  public id!: string;
  public userId!: string | null;
  public title!: string;
  public summary!: string | null;
  public startDate!: Date;
  public endDate!: Date;
  public durationDays!: number;
  public originCity!: string | null;
  public originLat!: number | null;
  public originLng!: number | null;
  public transportMode!: 'car' | 'public' | 'bike' | 'walk';
  public totalBudgetEstimate!: number | null;
  public currency!: string;
  public status!: 'draft' | 'final';
  public visibility!: 'private' | 'unlisted' | 'public';
  public shareSlug!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Trip.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'end_date',
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'duration_days',
    },
    originCity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'origin_city',
    },
    originLat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      field: 'origin_lat',
    },
    originLng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      field: 'origin_lng',
    },
    transportMode: {
      type: DataTypes.ENUM('car', 'public', 'bike', 'walk'),
      allowNull: false,
      field: 'transport_mode',
    },
    totalBudgetEstimate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'total_budget_estimate',
    },
    currency: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    status: {
      type: DataTypes.ENUM('draft', 'final'),
      defaultValue: 'draft',
    },
    visibility: {
      type: DataTypes.ENUM('private', 'unlisted', 'public'),
      defaultValue: 'private',
    },
    shareSlug: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      field: 'share_slug',
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
    tableName: 'trips',
    timestamps: true,
    underscored: true,
  },
);

export default Trip;
