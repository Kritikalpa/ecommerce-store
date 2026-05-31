import type { Order, OrderItem, Cart } from '@ecommerce/shared';
import { store } from '../store';
import { clearCart } from './cart.service';
import { calculateDiscount, checkAndIncrementPendingDiscount, markDiscountCodeAsUsed } from './discount.service';

function generateOrderId(): string {
  return `o-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function calculateSubtotal(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export interface CheckoutInput {
  discountCode?: string;
}

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

export function getOrder(orderId: string): Order | undefined {
  return store.orders.find((order) => order.id === orderId);
}
