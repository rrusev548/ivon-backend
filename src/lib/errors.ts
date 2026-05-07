import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      reply.code(400).send({ error: 'invalid_request', details: err.flatten() });
      return;
    }
    if (err instanceof HttpError) {
      reply.code(err.statusCode).send({ error: err.code, message: err.message });
      return;
    }
    req.log.error({ err }, 'unhandled error');
    reply.code(500).send({ error: 'internal_error' });
  });
}
