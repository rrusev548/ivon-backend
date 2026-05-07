import type { FastifyPluginAsync } from 'fastify';
import { PollDeviceFlow, StartDeviceFlow } from '../lib/schemas.js';
import { pollToken, startDeviceFlow } from '../services/higgsfield-oauth.js';
import { saveToken } from '../services/token-store.js';

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/device/start', async (req) => {
    const { scope } = StartDeviceFlow.parse(req.body ?? {});
    const auth = await startDeviceFlow(scope);
    return {
      device_code: auth.device_code,
      user_code: auth.user_code,
      verification_uri: auth.verification_uri,
      verification_uri_complete: auth.verification_uri_complete ?? null,
      expires_in: auth.expires_in,
      interval: auth.interval,
    };
  });

  app.post('/device/poll', async (req, reply) => {
    const { device_code } = PollDeviceFlow.parse(req.body ?? {});
    const result = await pollToken(device_code);
    if (result.status === 'pending') {
      reply.code(202);
      return { status: 'pending', error: result.error };
    }
    if (result.status === 'error') {
      reply.code(400);
      return { status: 'error', error: result.error };
    }
    saveToken(device_code, result.token);
    return {
      status: 'authorized',
      token_type: result.token.token_type,
      expires_in: result.token.expires_in ?? null,
      scope: result.token.scope ?? null,
    };
  });
};
