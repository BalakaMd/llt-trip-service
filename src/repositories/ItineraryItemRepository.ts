import BaseRepository from './BaseRepository';
import { ItineraryItem } from '../models';

class ItineraryItemRepository extends BaseRepository<ItineraryItem> {
  constructor() {
    super(ItineraryItem);
  }

  async findByTripId(tripId: string): Promise<ItineraryItem[]> {
    return await this.model.findAll({
      where: { tripId },
      order: [
        ['dayIndex', 'ASC'],
        ['orderIndex', 'ASC']
      ]
    });
  }

  async deleteByTripId(tripId: string): Promise<number> {
    return await this.model.destroy({
      where: { tripId } as any
    });
  }
}

export default new ItineraryItemRepository();
