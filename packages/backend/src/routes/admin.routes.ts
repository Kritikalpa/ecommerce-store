import type { FastifyInstance } from 'fastify';
import { adminAuthMiddleware } from '../middleware/admin-auth.middleware';
import { getStats } from '../services/admin.service';
import { generateDiscountCode } from '../services/discount.service';

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', adminAuthMiddleware);

  fastify.post('/api/admin/discount-codes/generate', async (request, reply) => {
    try {
      const discountCode = generateDiscountCode();
      return { code: discountCode.code, discountPercentage: discountCode.discountPercentage };
    } catch (error: unknown) {
      reply.code(400);
      return { error: (error as Error).message };
    }
  });

  fastify.get('/api/admin/stats', async (request, reply) => {
    return getStats();
  });
}
