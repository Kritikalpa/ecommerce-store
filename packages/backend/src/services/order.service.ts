import type { Order, OrderItem, Cart } from '@ecommerce/shared';
import { store } from '../store';
import { clearCart } from './cart.service';
import { calculateDiscount, checkAndIncrementPendingDiscount, markDiscountCodeAsUsed } from './discount.service';

/**
 * Generates a unique order ID with timestamp and random suffix.
 */
function generateOrderId(): string {
  return `o-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Calculates the cart subtotal by summing unitPrice * quantity for all items.
 */
function calculateSubtotal(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export interface CheckoutInput {
  discountCode?: string;
}

/**
 * Processes checkout for a session:
 * 1. Validates cart is non-empty
 * 2. Validates and applies discount code if provided
 * 3. Creates an Order record with price snapshots
 * 4. Marks discount code as used if applied
 * 5. Clears the cart
 * 6. Checks if nth-order threshold is hit for discount generation
 */
export function checkout(sessionId: string, input?: CheckoutInput): Order {
  const cart = store.carts.get(sessionId);

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const subtotal = calculateSubtotal(cart);
  const { discountAmount, appliedCode } = calculateDiscount(subtotal, input?.discountCode);
  const total = subtotal - discountAmount;

  const orderItems: OrderItem[] = cart.items.map((item) => {
    const product = store.products.get(item.productId);
    return {
      ...item,
      productName: product?.name ?? 'Unknown Product',
    };
  });

  const order: Order = {
    id: generateOrderId(),
    sessionId,
    items: orderItems,
    subtotal,
    discountCode: appliedCode,
    discountAmount,
    total,
    createdAt: new Date().toISOString(),
  };

  if (appliedCode) {
    markDiscountCodeAsUsed(appliedCode, order.id);
  }

  store.orders.push(order);
  clearCart(sessionId);
  checkAndIncrementPendingDiscount();

  return order;
}

/**
 * Retrieves an order by its ID from the orders array.
 */
export function getOrder(orderId: string): Order | undefined {
  return store.orders.find((order) => order.id === orderId);
}
