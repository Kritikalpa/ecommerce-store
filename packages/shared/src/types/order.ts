import type { CartItem } from './cart';

export interface OrderItem extends CartItem {
  productName: string;
}

export interface Order {
  id: string;
  sessionId: string;
  items: OrderItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount: number;
  total: number;
  createdAt: string;
}
