import type { DiscountCode } from '@ecommerce/shared';
import { store } from '../store';

/**
 * Generates a random 4-character alphanumeric string for discount code suffix.
 */
function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Reads discount configuration from environment variables with defaults.
 */
export function getDiscountConfig(): { everyNthOrder: number; percentage: number } {
  return {
    everyNthOrder: parseInt(process.env.DISCOUNT_EVERY_NTH_ORDER ?? '5', 10),
    percentage: parseInt(process.env.DISCOUNT_PERCENTAGE ?? '10', 10),
  };
}

/**
 * Checks if the current order count is a multiple of N (from config).
 * If so, increments the pending discount generation counter.
 * Called after each successful checkout.
 */
export function checkAndIncrementPendingDiscount(): void {
  const { everyNthOrder } = getDiscountConfig();
  const orderCount = store.orders.length;

  if (orderCount > 0 && orderCount % everyNthOrder === 0) {
    store.pendingDiscountGeneration += 1;
  }
}

/**
 * Generates a new discount code if there are pending generations available.
 * Format: SAVE{X}-{RANDOM_4_CHARS} e.g. SAVE10-A1B2.
 * Decrements the pending counter after generation.
 */
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

/**
 * Validates a discount code: checks existence and that it hasn't been used.
 * Returns null if no code is provided, throws for invalid or used codes.
 */
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

/**
 * Calculates the discount amount for a given subtotal and optional code.
 * Uses Math.floor to avoid floating-point rounding issues.
 */
export function calculateDiscount(subtotal: number, code?: string): { discountAmount: number; appliedCode?: string } {
  const discount = validateDiscountCode(code);

  if (!discount) {
    return { discountAmount: 0 };
  }

  const discountAmount = Math.floor(subtotal * (discount.discountPercentage / 100));
  return { discountAmount, appliedCode: discount.code };
}

/**
 * Marks a discount code as used and records the order ID it was used in.
 */
export function markDiscountCodeAsUsed(code: string, orderId: string): void {
  const discountCode = store.discountCodes.get(code);

  if (discountCode) {
    discountCode.isUsed = true;
    discountCode.usedInOrderId = orderId;
  }
}
