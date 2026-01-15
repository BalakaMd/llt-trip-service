import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BudgetItemAttributes {
  id: string;
  tripId: string;
  category: 'transport' | 'stay' | 'food' | 'activities' | 'other';
  title: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  source: 'ai' | 'user' | 'integration';
  linkedItineraryItemId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface BudgetItemCreationAttributes
  extends Optional<
    BudgetItemAttributes,
    'id' | 'quantity' | 'linkedItineraryItemId' | 'createdAt' | 'updatedAt'
  > {}

class BudgetItem
  extends Model<BudgetItemAttributes, BudgetItemCreationAttributes>
  implements BudgetItemAttributes
{
  public id!: string;
  public tripId!: string;
  public category!: 'transport' | 'stay' | 'food' | 'activities' | 'other';
  public title!: string;
  public quantity!: number;
  public unitPrice!: number;
  public currency!: string;
  public source!: 'ai' | 'user' | 'integration';
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'unit_price',
    },
    currency: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    source: {
      type: DataTypes.ENUM('ai', 'user', 'integration'),
      allowNull: false,
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
