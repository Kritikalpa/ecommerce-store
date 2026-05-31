import type { DiscountCode } from '@ecommerce/shared';
import { store } from '../store';

export interface AdminStats {
  totalOrders: number;
  totalItemsPurchased: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  discountCodes: Array<{ code: string; isUsed: boolean; usedInOrderId?: string }>;
}

export function getStats(): AdminStats {
  const orders = store.orders;

  const totalOrders = orders.length;
  const totalItemsPurchased = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalDiscountGiven = orders.reduce((sum, order) => sum + order.discountAmount, 0);

  const discountCodes: Array<{ code: string; isUsed: boolean; usedInOrderId?: string }> = [];
  store.discountCodes.forEach((code: DiscountCode) => {
    discountCodes.push({
      code: code.code,
      isUsed: code.isUsed,
      usedInOrderId: code.usedInOrderId,
    });
  });

  return {
    totalOrders,
    totalItemsPurchased,
    totalRevenue,
    totalDiscountGiven,
    discountCodes,
  };
}
