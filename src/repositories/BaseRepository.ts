import { Model, ModelStatic, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';

class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findByPk(id);
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async create(data: any, options?: CreateOptions): Promise<T> {
    return await this.model.create(data, options);
  }

  async update(id: string, data: any, options?: UpdateOptions): Promise<number> {
    const [affectedCount] = await this.model.update(data, {
      ...options,
      where: { id } as any
    });
    return affectedCount;
  }

  async delete(id: string, options?: DestroyOptions): Promise<number> {
    return await this.model.destroy({
      ...options,
      where: { id } as any
    });
  }
}

export default BaseRepository;
