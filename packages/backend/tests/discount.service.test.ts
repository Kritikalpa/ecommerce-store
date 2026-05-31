import { describe, it, expect } from 'vitest';
import { store } from '../src/store';
import {
  generateDiscountCode,
  validateDiscountCode,
  calculateDiscount,
  markDiscountCodeAsUsed,
  checkAndIncrementPendingDiscount,
  getDiscountConfig,
} from '../src/services/discount.service';

describe('Discount Service', () => {
  describe('getDiscountConfig', () => {
    it('returns default config when env vars are not set', () => {
      const config = getDiscountConfig();
      expect(config.everyNthOrder).toBe(5);
      expect(config.percentage).toBe(10);
    });
  });

  describe('generateDiscountCode', () => {
    it('throws when no pending codes available', () => {
      expect(() => generateDiscountCode()).toThrow('No pending discount codes to generate');
    });

    it('generates code when pendingDiscountGeneration > 0', () => {
      store.pendingDiscountGeneration = 1;
      const code = generateDiscountCode();

      expect(code.code).toMatch(/^SAVE10-[A-Z0-9]{4}$/);
      expect(code.discountPercentage).toBe(10);
      expect(code.isUsed).toBe(false);
      expect(store.pendingDiscountGeneration).toBe(0);
      expect(store.discountCodes.has(code.code)).toBe(true);
    });

    it('decrements pendingDiscountGeneration after generation', () => {
      store.pendingDiscountGeneration = 2;
      generateDiscountCode();
      expect(store.pendingDiscountGeneration).toBe(1);
    });
  });

  describe('validateDiscountCode', () => {
    it('returns null when no code provided', () => {
      const result = validateDiscountCode();
      expect(result).toBeNull();
    });

    it('throws for non-existent code', () => {
      expect(() => validateDiscountCode('INVALID-1234')).toThrow('Invalid discount code');
    });

    it('throws for already-used code', () => {
      store.pendingDiscountGeneration = 1;
      const code = generateDiscountCode();
      markDiscountCodeAsUsed(code.code, 'o-1');

      expect(() => validateDiscountCode(code.code)).toThrow('Discount code has already been used');
    });

    it('returns discount code for valid unused code', () => {
      store.pendingDiscountGeneration = 1;
      const code = generateDiscountCode();

      const result = validateDiscountCode(code.code);
      expect(result).not.toBeNull();
      expect(result?.code).toBe(code.code);
    });
  });

  describe('calculateDiscount', () => {
    it('returns zero discount when no code provided', () => {
      const result = calculateDiscount(10000);
      expect(result.discountAmount).toBe(0);
      expect(result.appliedCode).toBeUndefined();
    });

    it('calculates correct discount amount for valid code', () => {
      store.pendingDiscountGeneration = 1;
      const code = generateDiscountCode();

      const result = calculateDiscount(10000, code.code);
      expect(result.discountAmount).toBe(1000);
      expect(result.appliedCode).toBe(code.code);
    });

    it('rounds down discount amount', () => {
      store.pendingDiscountGeneration = 1;
      const code = generateDiscountCode();

      const result = calculateDiscount(10001, code.code);
      expect(result.discountAmount).toBe(1000);
    });
  });

  describe('markDiscountCodeAsUsed', () => {
    it('marks code as used and sets usedInOrderId', () => {
      store.pendingDiscountGeneration = 1;
      const code = generateDiscountCode();

      markDiscountCodeAsUsed(code.code, 'o-123');
      const updated = store.discountCodes.get(code.code);

      expect(updated?.isUsed).toBe(true);
      expect(updated?.usedInOrderId).toBe('o-123');
    });
  });

  describe('checkAndIncrementPendingDiscount', () => {
    it('increments pendingDiscountGeneration at nth order', () => {
      store.pendingDiscountGeneration = 0;

      for (let i = 0; i < 5; i++) {
        store.orders.push({
          id: `o-${i}`,
          sessionId: 'test',
          items: [],
          subtotal: 1000,
          discountAmount: 0,
          total: 1000,
          createdAt: new Date().toISOString(),
        });
      }

      checkAndIncrementPendingDiscount();
      expect(store.pendingDiscountGeneration).toBe(1);
    });

    it('does not increment when order count is not a multiple of N', () => {
      store.pendingDiscountGeneration = 0;

      for (let i = 0; i < 3; i++) {
        store.orders.push({
          id: `o-${i}`,
          sessionId: 'test',
          items: [],
          subtotal: 1000,
          discountAmount: 0,
          total: 1000,
          createdAt: new Date().toISOString(),
        });
      }

      checkAndIncrementPendingDiscount();
      expect(store.pendingDiscountGeneration).toBe(0);
    });
  });
});
