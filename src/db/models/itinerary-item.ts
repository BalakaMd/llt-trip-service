import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

export class ItineraryItem extends Model<
  InferAttributes<ItineraryItem>,
  InferCreationAttributes<ItineraryItem>
> {
  declare id: string;
  declare trip_id: string;
  declare place_id: string | null;

  declare day_index: number;
  declare order_index: number;

  declare title: string | null;
  declare description: string | null;

  declare snapshot_lat: string;
  declare snapshot_lng: string;
  declare snapshot_address: string | null;

  declare planned_start_at: Date | null;
  declare planned_end_at: Date | null;

  declare transport_segment: object | null;
  declare cost_estimate: number | null;
  declare snapshot_place_name: string | null;

  declare created_at: Date;
  declare updated_at: Date;

  static initModel(sequelize: Sequelize) {
    ItineraryItem.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },

        trip_id: { type: DataTypes.UUID, allowNull: false },
        place_id: { type: DataTypes.UUID, allowNull: true },

        day_index: { type: DataTypes.INTEGER, allowNull: false },
        order_index: { type: DataTypes.INTEGER, allowNull: false },

        title: { type: DataTypes.STRING(255), allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },

        snapshot_lat: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
        snapshot_lng: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
        snapshot_address: { type: DataTypes.TEXT, allowNull: true },

        planned_start_at: { type: DataTypes.DATE, allowNull: true },
        planned_end_at: { type: DataTypes.DATE, allowNull: true },

        transport_segment: { type: DataTypes.JSONB, allowNull: true },
        cost_estimate: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
        snapshot_place_name: { type: DataTypes.TEXT, allowNull: true },

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
        tableName: 'itinerary_items',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [{ name: 'idx_itinerary_trip', fields: ['trip_id'] }],
      },
    );

    // composite unique(trip_id, day_index, order_index)
    ItineraryItem.addHook('afterSync', async () => {});
  }
}
