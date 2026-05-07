import type { FastifyPluginAsync } from 'fastify';
import { Generate, MarketplaceCards } from '../lib/schemas.js';
import { flagsFromObject, runCliJson } from '../services/higgsfield-cli.js';

export const higgsfieldRoutes: FastifyPluginAsync = async (app) => {
  app.post('/marketplace-cards', async (req) => {
    const body = MarketplaceCards.parse(req.body ?? {});
    const { image, asset, ...rest } = body;
    const args = ['marketplace-cards', 'create', ...flagsFromObject(rest)];
    if (image) {
      const images = Array.isArray(image) ? image : [image];
      for (const i of images) args.push('--image', i);
    }
    if (asset) {
      for (const a of asset) args.push('--asset', a);
    }
    return await runCliJson<unknown>(args);
  });

  app.post('/generate', async (req) => {
    const body = Generate.parse(req.body ?? {});
    const { model, extra, wait, ...rest } = body;
    const args = ['generate', 'create', model, ...flagsFromObject(rest)];
    if (extra) args.push(...flagsFromObject(extra));
    if (wait) args.push('--wait');
    return await runCliJson<unknown>(args);
  });
};
