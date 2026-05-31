import type { FastifyInstance } from 'fastify';
import { validateDiscountCode } from '../services/discount.service';

export async function discountRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get<{ Querystring: { code: string } }>(
    '/api/discount/validate',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['code'],
          properties: { code: { type: 'string' } },
        },
      },
    },
    async (request, reply) => {
      const { code } = request.query;

      try {
        const discount = validateDiscountCode(code);
        return { code: discount!.code, discountPercentage: discount!.discountPercentage };
      } catch (error: unknown) {
        reply.code(400);
        return { error: (error as Error).message };
      }
    }
  );
}
