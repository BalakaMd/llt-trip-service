import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PlaceAttributes {
  id: string;
  externalRef: string;
  name: string;
  lat: number;
  lng: number;
  address: string | null;
  categories: object | null;
  rating: number | null;
  updatedAt: Date;
}

interface PlaceCreationAttributes extends Optional<PlaceAttributes, 'id' | 'address' | 'categories' | 'rating' | 'updatedAt'> {}

class Place extends Model<PlaceAttributes, PlaceCreationAttributes> implements PlaceAttributes {
  public id!: string;
  public externalRef!: string;
  public name!: string;
  public lat!: number;
  public lng!: number;
  public address!: string | null;
  public categories!: object | null;
  public rating!: number | null;
  public readonly updatedAt!: Date;
}

Place.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    externalRef: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'external_ref'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categories: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  },
  {
    sequelize,
    tableName: 'places',
    schema: 'trip',
    timestamps: false,
    underscored: true
  }
);

export default Place;
