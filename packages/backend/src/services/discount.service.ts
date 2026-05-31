import type { DiscountCode } from '@ecommerce/shared';
import { store } from '../store';

function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getDiscountConfig(): { everyNthOrder: number; percentage: number } {
  return {
    everyNthOrder: parseInt(process.env.DISCOUNT_EVERY_NTH_ORDER ?? '5', 10),
    percentage: parseInt(process.env.DISCOUNT_PERCENTAGE ?? '10', 10),
  };
}

export function checkAndIncrementPendingDiscount(): void {
  const { everyNthOrder } = getDiscountConfig();
  const orderCount = store.orders.length;

  if (orderCount > 0 && orderCount % everyNthOrder === 0) {
    store.pendingDiscountGeneration += 1;
  }
}

export function generateDiscountCode(): DiscountCode {
  if (store.pendingDiscountGeneration <= 0) {
    throw new Error('No pending discount codes to generate');
  }

  const { percentage } = getDiscountConfig();
  const code = `SAVE${percentage}-${generateRandomCode()}`;

  const discountCode: DiscountCode = {
    code,
    discountPercentage: percentage,
    isUsed: false,
    createdForOrderCount: store.orders.length,
    createdAt: new Date().toISOString(),
  };

  store.discountCodes.set(code, discountCode);
  store.pendingDiscountGeneration -= 1;

  return discountCode;
}

export function validateDiscountCode(code?: string): DiscountCode | null {
  if (!code) {
    return null;
  }

  const discountCode = store.discountCodes.get(code);

  if (!discountCode) {
    throw new Error('Invalid discount code');
  }

  if (discountCode.isUsed) {
    throw new Error('Discount code has already been used');
  }

  return discountCode;
}

export function calculateDiscount(subtotal: number, code?: string): { discountAmount: number; appliedCode?: string } {
  const discount = validateDiscountCode(code);

  if (!discount) {
    return { discountAmount: 0 };
  }

  const discountAmount = Math.floor(subtotal * (discount.discountPercentage / 100));
  return { discountAmount, appliedCode: discount.code };
}

export function markDiscountCodeAsUsed(code: string, orderId: string): void {
  const discountCode = store.discountCodes.get(code);

  if (discountCode) {
    discountCode.isUsed = true;
    discountCode.usedInOrderId = orderId;
  }
}
