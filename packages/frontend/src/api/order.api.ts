import type { Order } from '@ecommerce/shared';
import client from './client';

export interface CheckoutPayload {
  discountCode?: string;
}

export async function checkout(payload?: CheckoutPayload): Promise<Order> {
  const response = await client.post<Order>('/orders/checkout', payload ?? {});
  return response.data;
}

export async function getOrder(id: string): Promise<Order> {
  const response = await client.get<Order>(`/orders/${id}`);
  return response.data;
}
