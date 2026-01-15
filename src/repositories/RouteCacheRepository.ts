import BaseRepository from './BaseRepository';
import { RouteCache } from '../models';

class RouteCacheRepository extends BaseRepository<RouteCache> {
  constructor() {
    super(RouteCache);
  }

  async findByTripId(tripId: string): Promise<RouteCache | null> {
    return await this.model.findOne({
      where: { tripId },
    });
  }

  async findByRequestSig(requestSig: string): Promise<RouteCache | null> {
    return await this.model.findOne({
      where: { requestSig },
    });
  }

  async upsertByTripId(tripId: string, data: any): Promise<RouteCache> {
    const [instance] = await this.model.upsert({
      tripId,
      ...data,
    });
    return instance;
  }

  async deleteByTripId(tripId: string): Promise<number> {
    return await this.model.destroy({
      where: { tripId },
    });
  }

  async cleanupOldCache(olderThanHours: number = 24): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - olderThanHours);

    return await this.model.destroy({
      where: {
        fetchedAt: {
          [require('sequelize').Op.lt]: cutoffDate,
        },
      },
    });
  }
}

export default new RouteCacheRepository();
