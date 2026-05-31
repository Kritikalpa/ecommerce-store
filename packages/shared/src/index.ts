import type { Product, CartItem, Cart, OrderItem, Order, DiscountCode } from './types';

export interface StoreState {
  products: Map<string, Product>;
  carts: Map<string, Cart>;
  orders: Order[];
  discountCodes: Map<string, DiscountCode>;
  pendingDiscountGeneration: number;
}

export type { Product, CartItem, Cart, OrderItem, Order, DiscountCode };
