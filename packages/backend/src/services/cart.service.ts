import type { Cart, CartItem } from '@ecommerce/shared';
import { store } from '../store';

function getOrCreateCart(sessionId: string): Cart {
  let cart = store.carts.get(sessionId);

  if (!cart) {
    cart = {
      sessionId,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    store.carts.set(sessionId, cart);
  }

  return cart;
}

export function getCart(sessionId: string): Cart {
  return getOrCreateCart(sessionId);
}

export function addItem(sessionId: string, productId: string, quantity: number): Cart {
  const cart = getOrCreateCart(sessionId);
  const product = store.products.get(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.price,
    });
  }

  cart.updatedAt = new Date().toISOString();
  return cart;
}

export function updateItem(sessionId: string, productId: string, quantity: number): Cart {
  const cart = getOrCreateCart(sessionId);
  const item = cart.items.find((item) => item.productId === productId);

  if (!item) {
    return cart;
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.productId !== productId);
  } else {
    item.quantity = quantity;
  }

  cart.updatedAt = new Date().toISOString();
  return cart;
}

export function removeItem(sessionId: string, productId: string): Cart {
  const cart = getOrCreateCart(sessionId);
  cart.items = cart.items.filter((item) => item.productId !== productId);
  cart.updatedAt = new Date().toISOString();
  return cart;
}

export function clearCart(sessionId: string): void {
  const cart = store.carts.get(sessionId);

  if (cart) {
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
  }
}
