import client from './client';

export async function validateDiscountCode(code: string): Promise<{ code: string; discountPercentage: number }> {
  const response = await client.get(`/discount/validate`, { params: { code } });
  return response.data;
}
