import type { Cart } from '@ecommerce/shared';
import client from './client';

export async function getCart(): Promise<Cart> {
  const response = await client.get<Cart>('/cart');
  return response.data;
}

export async function addItem(productId: string, quantity: number): Promise<Cart> {
  const response = await client.post<Cart>('/cart/items', { productId, quantity });
  return response.data;
}

export async function updateItem(productId: string, quantity: number): Promise<Cart> {
  const response = await client.put<Cart>(`/cart/items/${productId}`, { quantity });
  return response.data;
}

export async function removeItem(productId: string): Promise<Cart> {
  const response = await client.delete<Cart>(`/cart/items/${productId}`);
  return response.data;
}

export async function clearCart(): Promise<void> {
  await client.delete('/cart');
}
