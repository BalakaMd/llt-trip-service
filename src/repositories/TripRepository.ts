import BaseRepository from './BaseRepository';
import { Trip } from '../models';

class TripRepository extends BaseRepository<Trip> {
  constructor() {
    super(Trip);
  }

  async findByUserId(userId: string): Promise<Trip[]> {
    return await this.model.findAll({
      where: { userId }
    });
  }

  async findByShareSlug(shareSlug: string): Promise<Trip | null> {
    return await this.model.findOne({
      where: { shareSlug }
    });
  }
}

export default new TripRepository();
