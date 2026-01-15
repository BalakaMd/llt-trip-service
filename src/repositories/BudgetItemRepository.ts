import BaseRepository from './BaseRepository';
import { BudgetItem } from '../models';

class BudgetItemRepository extends BaseRepository<BudgetItem> {
  constructor() {
    super(BudgetItem);
  }

  async findByTripId(tripId: string): Promise<BudgetItem[]> {
    return await this.model.findAll({
      where: { tripId },
      order: [
        ['category', 'ASC'],
        ['title', 'ASC'],
      ],
    });
  }

  async findByTripIdAndCategory(
    tripId: string,
    category: string,
  ): Promise<BudgetItem[]> {
    return await this.model.findAll({
      where: { tripId, category },
      order: [['title', 'ASC']],
    });
  }

  async getBudgetSummary(tripId: string): Promise<any> {
    const items = await this.findByTripId(tripId);

    const summary = {
      totalAmount: 0,
      currency: items[0]?.currency || 'USD',
      categories: {} as any,
    };

    items.forEach(item => {
      const totalPrice = item.unitPrice * item.quantity;
      summary.totalAmount += totalPrice;

      if (!summary.categories[item.category]) {
        summary.categories[item.category] = {
          amount: 0,
          items: 0,
        };
      }

      summary.categories[item.category].amount += totalPrice;
      summary.categories[item.category].items += 1;
    });

    return summary;
  }

  async deleteByTripId(tripId: string): Promise<number> {
    return await this.model.destroy({
      where: { tripId },
    });
  }
}

export default new BudgetItemRepository();
