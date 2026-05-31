import type { DiscountCode } from '@ecommerce/shared';
import { store } from '../store';

export interface AdminStats {
  totalOrders: number;
  totalItemsPurchased: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  discountCodes: Array<{ code: string; isUsed: boolean; usedInOrderId?: string }>;
  pendingDiscountGeneration: number;
}

/**
 * Aggregates store statistics from the in-memory store:
 * - Total order count
 * - Total items purchased across all orders
 * - Total revenue (sum of order totals, after discounts)
 * - Total discount amount given
 * - List of all discount codes with their usage status
 * - Number of pending discount code generations
 */
export function getStats(): AdminStats {
  const orders = store.orders;
  const pendingDiscountGeneration = store.pendingDiscountGeneration;

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
    pendingDiscountGeneration,
  };
}
