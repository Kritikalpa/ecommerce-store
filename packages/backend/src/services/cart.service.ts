import type { Cart, CartItem } from '@ecommerce/shared';
import { store } from '../store';

/**
 * Retrieves an existing cart or creates a new one for the given session.
 * Carts are keyed by sessionId and stored in the in-memory store.
 */
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

/**
 * Returns the cart for a session, creating one if it doesn't exist.
 */
export function getCart(sessionId: string): Cart {
  return getOrCreateCart(sessionId);
}

/**
 * Adds a product to the cart. If the product already exists in the cart,
 * the quantity is incremented. Stores the product name and price snapshot.
 */
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

/**
 * Updates the quantity of an item in the cart. If quantity is zero or negative,
 * the item is removed. Returns the cart unchanged if the item doesn't exist.
 */
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

/**
 * Removes an item from the cart. Idempotent — no-op if the item doesn't exist.
 */
export function removeItem(sessionId: string, productId: string): Cart {
  const cart = getOrCreateCart(sessionId);
  cart.items = cart.items.filter((item) => item.productId !== productId);
  cart.updatedAt = new Date().toISOString();
  return cart;
}

/**
 * Clears all items from the cart. No-op if the cart doesn't exist.
 */
export function clearCart(sessionId: string): void {
  const cart = store.carts.get(sessionId);

  if (cart) {
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
  }
}
