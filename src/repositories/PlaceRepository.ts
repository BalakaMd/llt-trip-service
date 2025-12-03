import BaseRepository from './BaseRepository';
import { Place } from '../models';

class PlaceRepository extends BaseRepository<Place> {
  constructor() {
    super(Place);
  }

  async findByExternalRef(externalRef: string): Promise<Place | null> {
    return await this.model.findOne({
      where: { externalRef }
    });
  }

  async findOrCreate(data: {
    externalRef: string;
    name: string;
    lat: number;
    lng: number;
    address?: string;
    categories?: object;
    rating?: number;
  }): Promise<Place> {
    const [place] = await this.model.findOrCreate({
      where: { externalRef: data.externalRef },
      defaults: data
    });
    return place;
  }
}

export default new PlaceRepository();
