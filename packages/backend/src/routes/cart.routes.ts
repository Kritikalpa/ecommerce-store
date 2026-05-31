import type { FastifyInstance } from 'fastify';
import { sessionMiddleware } from '../middleware/session.middleware';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../services/cart.service';

export async function cartRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', sessionMiddleware);

  fastify.get('/api/cart', async (request, reply) => {
    const sessionId = (request as any).sessionId;
    return getCart(sessionId);
  });

  fastify.post<{ Body: { productId: string; quantity: number } }>(
    '/api/cart/items',
    {
      schema: {
        body: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string' },
            quantity: { type: 'integer', minimum: 1 },
          },
        },
      },
    },
    async (request, reply) => {
      const sessionId = (request as any).sessionId;
      const { productId, quantity } = request.body;
      return addItem(sessionId, productId, quantity);
    }
  );

  fastify.put<{ Params: { productId: string }; Body: { quantity: number } }>(
    '/api/cart/items/:productId',
    {
      schema: {
        params: {
          type: 'object',
          required: ['productId'],
          properties: { productId: { type: 'string' } },
        },
        body: {
          type: 'object',
          required: ['quantity'],
          properties: { quantity: { type: 'integer' } },
        },
      },
    },
    async (request, reply) => {
      const sessionId = (request as any).sessionId;
      const { productId } = request.params;
      const { quantity } = request.body;
      return updateItem(sessionId, productId, quantity);
    }
  );

  fastify.delete<{ Params: { productId: string } }>(
    '/api/cart/items/:productId',
    {
      schema: {
        params: {
          type: 'object',
          required: ['productId'],
          properties: { productId: { type: 'string' } },
        },
      },
    },
    async (request, reply) => {
      const sessionId = (request as any).sessionId;
      const { productId } = request.params;
      return removeItem(sessionId, productId);
    }
  );

  fastify.delete('/api/cart', async (request, reply) => {
    const sessionId = (request as any).sessionId;
    clearCart(sessionId);
    reply.code(204);
  });
}
