import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

const SESSION_HEADER = 'x-session-id';

export function sessionMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  const sessionId = request.headers[SESSION_HEADER] as string | undefined;

  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    request.log.warn({ header: SESSION_HEADER }, 'Missing session header');
    done(new Error(`Missing required header: ${SESSION_HEADER}`));
    return;
  }

  (request as FastifyRequest & { sessionId: string }).sessionId = sessionId.trim();
  done();
}
