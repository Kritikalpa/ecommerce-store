export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
  updatedAt: string;
}
