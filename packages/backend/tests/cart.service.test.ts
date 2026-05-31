import { describe, it, expect } from 'vitest';
import { store } from '../src/store';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../src/services/cart.service';

describe('Cart Service', () => {
  const sessionId = 'test-session-1';
  const productId = 'p1';

  describe('getCart', () => {
    it('creates a new cart for unknown session', () => {
      const cart = getCart('new-session');

      expect(cart).toBeDefined();
      expect(cart.sessionId).toBe('new-session');
      expect(cart.items).toEqual([]);
    });

    it('returns existing cart for known session', () => {
      addItem(sessionId, productId, 1);
      const cart = getCart(sessionId);

      expect(cart.items.length).toBe(1);
    });
  });

  describe('addItem', () => {
    it('creates cart entry for new item', () => {
      const cart = addItem('new-session-2', 'p2', 2);

      expect(cart.items.length).toBe(1);
      expect(cart.items[0].productId).toBe('p2');
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items[0].unitPrice).toBe(8999);
    });

    it('increments quantity for existing item', () => {
      addItem(sessionId, productId, 1);
      const cart = addItem(sessionId, productId, 2);

      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(3);
    });

    it('throws for non-existent product', () => {
      expect(() => addItem(sessionId, 'non-existent', 1)).toThrow('Product not found');
    });

    it('updates updatedAt timestamp', () => {
      const before = new Date().toISOString();
      const cart = addItem('new-session-3', 'p3', 1);

      expect(cart.updatedAt >= before).toBe(true);
    });
  });

  describe('updateItem', () => {
    it('updates quantity for existing item', () => {
      addItem('update-session', 'p1', 5);
      const cart = updateItem('update-session', 'p1', 3);

      expect(cart.items[0].quantity).toBe(3);
    });

    it('removes item when quantity is zero', () => {
      addItem('update-session-2', 'p1', 5);
      const cart = updateItem('update-session-2', 'p1', 0);

      expect(cart.items.length).toBe(0);
    });

    it('removes item when quantity is negative', () => {
      addItem('update-session-3', 'p1', 5);
      const cart = updateItem('update-session-3', 'p1', -1);

      expect(cart.items.length).toBe(0);
    });

    it('is no-op for non-existent item', () => {
      const cart = updateItem('update-session-4', 'p1', 10);

      expect(cart.items.length).toBe(0);
    });
  });

  describe('removeItem', () => {
    it('removes item from cart', () => {
      addItem('remove-session', 'p1', 1);
      addItem('remove-session', 'p2', 1);
      const cart = removeItem('remove-session', 'p1');

      expect(cart.items.length).toBe(1);
      expect(cart.items[0].productId).toBe('p2');
    });

    it('is no-op for non-existent item', () => {
      addItem('remove-session-2', 'p1', 1);
      const cart = removeItem('remove-session-2', 'p99');

      expect(cart.items.length).toBe(1);
    });

    it('updates updatedAt timestamp', () => {
      addItem('remove-session-3', 'p1', 1);
      const before = new Date().toISOString();
      const cart = removeItem('remove-session-3', 'p1');

      expect(cart.updatedAt >= before).toBe(true);
    });
  });

  describe('clearCart', () => {
    it('empties all items from cart', () => {
      addItem('clear-session', 'p1', 1);
      addItem('clear-session', 'p2', 2);
      clearCart('clear-session');

      const cart = getCart('clear-session');
      expect(cart.items.length).toBe(0);
    });

    it('is no-op for non-existent cart', () => {
      expect(() => clearCart('non-existent-session')).not.toThrow();
    });

    it('updates updatedAt timestamp', () => {
      addItem('clear-session-2', 'p1', 1);
      const before = new Date().toISOString();
      clearCart('clear-session-2');

      const cart = getCart('clear-session-2');
      expect(cart.updatedAt >= before).toBe(true);
    });
  });
});
