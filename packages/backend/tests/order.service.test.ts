import { describe, it, expect } from 'vitest';
import { store } from '../src/store';
import { checkout, getOrder } from '../src/services/order.service';
import { addItem } from '../src/services/cart.service';
import { generateDiscountCode } from '../src/services/discount.service';

describe('Order Service', () => {
  const sessionId = 'order-session';

  describe('checkout', () => {
    it('fails on empty cart', () => {
      expect(() => checkout(sessionId)).toThrow('Cart is empty');
    });

    it('succeeds without discount', () => {
      addItem(sessionId, 'p1', 2);

      const order = checkout(sessionId);

      expect(order.id).toBeDefined();
      expect(order.sessionId).toBe(sessionId);
      expect(order.items.length).toBe(1);
      expect(order.items[0].productId).toBe('p1');
      expect(order.items[0].quantity).toBe(2);
      expect(order.items[0].productName).toBe('Minimalist Watch');
      expect(order.subtotal).toBe(25998);
      expect(order.discountAmount).toBe(0);
      expect(order.total).toBe(25998);
    });

    it('fails on invalid discount code', () => {
      addItem(sessionId, 'p1', 1);

      expect(() => checkout(sessionId, { discountCode: 'INVALID-1234' })).toThrow('Invalid discount code');
    });

    it('applies correct discount amount', () => {
      addItem(sessionId, 'p1', 1);
      store.pendingDiscountGeneration = 1;
      const discount = generateDiscountCode();

      const order = checkout(sessionId, { discountCode: discount.code });

      expect(order.discountCode).toBe(discount.code);
      expect(order.discountAmount).toBe(1299);
      expect(order.total).toBe(11700);
    });

    it('clears cart post-checkout', () => {
      addItem(sessionId, 'p1', 1);

      checkout(sessionId);
      const cart = store.carts.get(sessionId);

      expect(cart?.items.length).toBe(0);
    });

    it('increments pendingDiscountGeneration on nth order', () => {
      store.pendingDiscountGeneration = 0;

      for (let i = 0; i < 5; i++) {
        const session = `nth-session-${i}`;
        addItem(session, 'p1', 1);
        checkout(session);
      }

      expect(store.pendingDiscountGeneration).toBe(1);
    });

    it('stores order in orders array', () => {
      addItem(sessionId, 'p2', 3);

      const order = checkout(sessionId);
      const storedOrder = getOrder(order.id);

      expect(storedOrder).toBeDefined();
      expect(storedOrder?.id).toBe(order.id);
      expect(store.orders.length).toBe(1);
    });
  });

  describe('getOrder', () => {
    it('returns undefined for non-existent order', () => {
      const order = getOrder('non-existent');
      expect(order).toBeUndefined();
    });

    it('returns order for valid id', () => {
      addItem(sessionId, 'p1', 1);
      const order = checkout(sessionId);

      const found = getOrder(order.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(order.id);
    });
  });
});
