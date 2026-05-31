import 'dotenv/config';
import Fastify from 'fastify';
import corsPlugin from './plugins/cors';
import { productRoutes } from './routes/product.routes';
import { discountRoutes } from './routes/discount.routes';
import { cartRoutes } from './routes/cart.routes';
import { orderRoutes } from './routes/order.routes';
import { adminRoutes } from './routes/admin.routes';

const fastify = Fastify({
  logger: true,
});

async function start(): Promise<void> {
  await fastify.register(corsPlugin);

  await fastify.register(productRoutes);
  await fastify.register(discountRoutes);
  await fastify.register(cartRoutes);
  await fastify.register(orderRoutes);
  await fastify.register(adminRoutes);

  const port = parseInt(process.env.PORT ?? '3001', 10);

  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
