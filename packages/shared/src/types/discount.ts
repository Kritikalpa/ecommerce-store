export interface DiscountCode {
  code: string;
  discountPercentage: number;
  isUsed: boolean;
  createdForOrderCount: number;
  usedInOrderId?: string;
  createdAt: string;
}
