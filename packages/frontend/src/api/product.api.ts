import type { Product } from '@ecommerce/shared';
import client from './client';

export async function getProducts(): Promise<Product[]> {
  const response = await client.get<Product[]>('/products');
  return response.data;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await client.get<Product>(`/products/${id}`);
  return response.data;
}
