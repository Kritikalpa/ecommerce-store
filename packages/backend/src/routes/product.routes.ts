import type { FastifyInstance } from 'fastify';
import { store } from '../store';

export async function productRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/products', async (request, reply) => {
    const products = Array.from(store.products.values());
    return products;
  });

  fastify.get<{ Params: { id: string } }>(
    '/api/products/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string' } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const product = store.products.get(id);

      if (!product) {
        reply.code(404);
        return { error: 'Product not found' };
      }

      return product;
    }
  );
}
