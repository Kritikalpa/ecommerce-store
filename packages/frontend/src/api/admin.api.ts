import client from './client';

export interface AdminStats {
  totalOrders: number;
  totalItemsPurchased: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  discountCodes: Array<{ code: string; isUsed: boolean; usedInOrderId?: string }>;
}

export interface GeneratedDiscountCode {
  code: string;
  discountPercentage: number;
}

export async function generateDiscountCode(adminKey: string): Promise<GeneratedDiscountCode> {
  const response = await client.post<GeneratedDiscountCode>('/admin/discount-codes/generate', undefined, {
    headers: { 'x-admin-key': adminKey },
  });
  return response.data;
}

export async function getStats(adminKey: string): Promise<AdminStats> {
  const response = await client.get<AdminStats>('/admin/stats', {
    headers: { 'x-admin-key': adminKey },
  });
  return response.data;
}
