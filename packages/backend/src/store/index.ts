import type { Product, Cart, Order, DiscountCode, StoreState } from '@ecommerce/shared';
import { seedProducts } from '../models/seed';

class Store {
  private static instance: Store;
  private state: StoreState;

  private constructor() {
    const products = seedProducts();
    this.state = {
      products,
      carts: new Map<string, Cart>(),
      orders: [],
      discountCodes: new Map<string, DiscountCode>(),
      pendingDiscountGeneration: 0,
    };
  }

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  get products(): Map<string, Product> {
    return this.state.products;
  }

  get carts(): Map<string, Cart> {
    return this.state.carts;
  }

  get orders(): Order[] {
    return this.state.orders;
  }

  get discountCodes(): Map<string, DiscountCode> {
    return this.state.discountCodes;
  }

  get pendingDiscountGeneration(): number {
    return this.state.pendingDiscountGeneration;
  }

  set pendingDiscountGeneration(value: number) {
    this.state.pendingDiscountGeneration = value;
  }

  reset(): void {
    const products = seedProducts();
    this.state = {
      products,
      carts: new Map<string, Cart>(),
      orders: [],
      discountCodes: new Map<string, DiscountCode>(),
      pendingDiscountGeneration: 0,
    };
  }
}

export const store = Store.getInstance();
