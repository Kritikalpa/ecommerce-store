import { describe, it, expect } from 'vitest';
import { store } from '../src/store';
import { getStats } from '../src/services/admin.service';
import { checkout } from '../src/services/order.service';
import { addItem } from '../src/services/cart.service';
import { generateDiscountCode } from '../src/services/discount.service';

describe('Admin Service', () => {
  describe('getStats', () => {
    it('returns zero totals when no orders exist', () => {
      const stats = getStats();

      expect(stats.totalOrders).toBe(0);
      expect(stats.totalItemsPurchased).toBe(0);
      expect(stats.totalRevenue).toBe(0);
      expect(stats.totalDiscountGiven).toBe(0);
      expect(stats.discountCodes).toEqual([]);
    });

    it('reflects correct order count', () => {
      addItem('stats-session-1', 'p1', 1);
      checkout('stats-session-1');

      addItem('stats-session-2', 'p2', 2);
      checkout('stats-session-2');

      const stats = getStats();

      expect(stats.totalOrders).toBe(2);
    });

    it('reflects correct total items purchased', () => {
      addItem('items-session-1', 'p1', 3);
      checkout('items-session-1');

      addItem('items-session-2', 'p2', 2);
      checkout('items-session-2');

      const stats = getStats();

      expect(stats.totalItemsPurchased).toBe(5);
    });

    it('reflects correct total revenue', () => {
      addItem('revenue-session', 'p1', 2);
      checkout('revenue-session');

      const stats = getStats();

      expect(stats.totalRevenue).toBe(25998);
    });

    it('reflects correct total discount given', () => {
      addItem('discount-session', 'p1', 1);
      store.pendingDiscountGeneration = 1;
      const discount = generateDiscountCode();
      checkout('discount-session', { discountCode: discount.code });

      const stats = getStats();

      expect(stats.totalDiscountGiven).toBe(1299);
    });

    it('lists all discount codes with usage status', () => {
      store.pendingDiscountGeneration = 2;
      const code1 = generateDiscountCode();
      const code2 = generateDiscountCode();

      const stats = getStats();

      expect(stats.discountCodes.length).toBe(2);
      expect(stats.discountCodes).toContainEqual({
        code: code1.code,
        isUsed: false,
        usedInOrderId: undefined,
      });
      expect(stats.discountCodes).toContainEqual({
        code: code2.code,
        isUsed: false,
        usedInOrderId: undefined,
      });
    });

    it('shows used discount codes with order id', () => {
      addItem('used-session', 'p1', 1);
      store.pendingDiscountGeneration = 1;
      const discount = generateDiscountCode();
      checkout('used-session', { discountCode: discount.code });

      const stats = getStats();

      expect(stats.discountCodes).toContainEqual({
        code: discount.code,
        isUsed: true,
        usedInOrderId: expect.any(String),
      });
    });
  });
});
