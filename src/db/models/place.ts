import { DataTypes, Model, Sequelize, InferAttributes, InferCreationAttributes } from "sequelize";

export class Place extends Model<InferAttributes<Place>, InferCreationAttributes<Place>> {
  declare id: string;
  declare external_ref: string;
  declare name: string;
  declare lat: string;
  declare lng: string;
  declare address: string | null;
  declare categories: object | null;
  declare rating: string | null;
  declare updated_at: Date;

  static initModel(sequelize: Sequelize) {
    Place.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        external_ref: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        lat: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
        lng: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
        address: { type: DataTypes.TEXT, allowNull: true },
        categories: { type: DataTypes.JSONB, allowNull: true },
        rating: { type: DataTypes.DECIMAL(2, 1), allowNull: true },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      },
      {
        sequelize,
        tableName: "places",
        timestamps: false,
        indexes: [{ name: "idx_places_external_ref", fields: ["external_ref"] }],
      }
    );
  }
}