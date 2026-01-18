import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

export class Trip extends Model<
  InferAttributes<Trip>,
  InferCreationAttributes<Trip>
> {
  declare id: string;
  declare user_id: string | null;
  declare title: string;
  declare summary: string | null;
  declare start_date: string; // DATEONLY -> string
  declare end_date: string;

  declare origin_city: string | null;
  declare origin_lat: number | null;
  declare origin_lng: number | null;
  declare transport_mode: string | null;
  declare total_budget_estimate: number | null;
  declare currency: string | null;

  declare status: 'draft' | 'final';
  declare visibility: 'private' | 'public' | 'shared';
  declare share_slug: string | null;

  declare created_at: Date;
  declare updated_at: Date;

  static initModel(sequelize: Sequelize) {
    Trip.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        user_id: { type: DataTypes.UUID, allowNull: true },

        title: { type: DataTypes.STRING(255), allowNull: false },
        summary: { type: DataTypes.TEXT, allowNull: true },

        start_date: { type: DataTypes.DATEONLY, allowNull: false },
        end_date: { type: DataTypes.DATEONLY, allowNull: false },

        origin_city: { type: DataTypes.STRING(255), allowNull: true },
        origin_lat: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
        origin_lng: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
        transport_mode: { type: DataTypes.STRING(50), allowNull: true },
        total_budget_estimate: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        currency: { type: DataTypes.STRING(3), allowNull: true },

        status: {
          type: DataTypes.ENUM('draft', 'final'),
          allowNull: false,
          defaultValue: 'draft',
        },
        visibility: {
          type: DataTypes.ENUM('private', 'public', 'shared'),
          allowNull: false,
          defaultValue: 'private',
        },

        share_slug: {
          type: DataTypes.STRING(100),
          allowNull: true,
          unique: true,
        },

        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'trips',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
          { name: 'idx_trips_user', fields: ['user_id'] },
          { name: 'idx_trips_share_slug', fields: ['share_slug'] },
        ],
      },
    );
  }
}
