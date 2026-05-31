import type { FastifyInstance } from 'fastify';
import { sessionMiddleware } from '../middleware/session.middleware';
import { checkout, getOrder } from '../services/order.service';

export async function orderRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/api/orders/checkout', { onRequest: [sessionMiddleware] }, async (request, reply) => {
    const sessionId = (request as any).sessionId;
    return checkout(sessionId);
  });

  fastify.get<{ Params: { id: string } }>('/api/orders/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const order = getOrder(id);

    if (!order) {
      reply.code(404);
      return { error: 'Order not found' };
    }

    return order;
  });
}
