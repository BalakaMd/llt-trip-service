import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BudgetItemAttributes {
  id: string;
  tripId: string;
  category: 'transport' | 'stay' | 'food' | 'activities' | 'other';
  amount: number;
  currency: string;
  description?: string;
  date?: Date;
  linkedItineraryItemId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface BudgetItemCreationAttributes extends Optional<
  BudgetItemAttributes,
  'id' | 'linkedItineraryItemId' | 'createdAt' | 'updatedAt'
> {}

class BudgetItem
  extends Model<BudgetItemAttributes, BudgetItemCreationAttributes>
  implements BudgetItemAttributes
{
  public id!: string;
  public tripId!: string;
  public category!: 'transport' | 'stay' | 'food' | 'activities' | 'other';
  public amount!: number;
  public currency!: string;
  public description?: string;
  public date?: Date;
  public linkedItineraryItemId!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BudgetItem.init(
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
    category: {
      type: DataTypes.ENUM('transport', 'stay', 'food', 'activities', 'other'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    linkedItineraryItemId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'linked_itinerary_item_id',
      references: {
        model: 'itinerary_items',
        key: 'id',
      },
      onDelete: 'SET NULL',
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
    tableName: 'budget_items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['trip_id'],
      },
      {
        fields: ['trip_id', 'category'],
      },
    ],
  },
);

export default BudgetItem;
