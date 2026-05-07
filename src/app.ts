import sensible from '@fastify/sensible';
import Fastify, { type FastifyInstance } from 'fastify';
import { config } from './config.js';
import { registerErrorHandler } from './lib/errors.js';
import { authRoutes } from './routes/auth.js';
import { healthRoutes } from './routes/health.js';
import { higgsfieldRoutes } from './routes/higgsfield.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport:
        config.NODE_ENV === 'production'
          ? undefined
          : {
              target: 'pino-pretty',
              options: { colorize: true, translateTime: 'SYS:HH:MM:ss.l' },
            },
    },
  });
  await app.register(sensible);
  registerErrorHandler(app);
  await app.register(healthRoutes);
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(higgsfieldRoutes, { prefix: '/higgsfield' });
  return app;
}
