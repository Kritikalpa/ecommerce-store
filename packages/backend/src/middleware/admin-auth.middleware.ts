import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

const ADMIN_HEADER = 'x-admin-key';

function getAdminApiKey(): string {
  return process.env.ADMIN_API_KEY ?? 'admin-secret-key';
}

export function adminAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  const providedKey = request.headers[ADMIN_HEADER] as string | undefined;
  const expectedKey = getAdminApiKey();

  if (!providedKey || providedKey !== expectedKey) {
    reply.code(401);
    done(new Error('Unauthorized'));
    return;
  }

  done();
}
