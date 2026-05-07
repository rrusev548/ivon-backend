import { z } from 'zod';

export const StartDeviceFlow = z.object({
  scope: z.string().optional(),
});
export type StartDeviceFlow = z.infer<typeof StartDeviceFlow>;

export const PollDeviceFlow = z.object({
  device_code: z.string().min(1),
});
export type PollDeviceFlow = z.infer<typeof PollDeviceFlow>;

export const MarketplaceCards = z.object({
  prompt: z.string().min(1),
  scope: z.enum(['main', 'product-images', 'aplus', 'full-set']).optional(),
  image: z.union([z.string(), z.array(z.string())]).optional(),
  asset: z.array(z.string()).optional(),
  main_job: z.string().optional(),
  product_context: z.string().optional(),
  brand_context: z.string().optional(),
  category: z.string().optional(),
  visual_style: z.string().optional(),
});
export type MarketplaceCards = z.infer<typeof MarketplaceCards>;

export const Generate = z.object({
  model: z.string().min(1),
  prompt: z.string().min(1),
  aspect_ratio: z.string().optional(),
  resolution: z.string().optional(),
  duration: z.coerce.number().int().positive().optional(),
  start_image: z.string().optional(),
  soul_id: z.string().optional(),
  wait: z.boolean().default(true),
  extra: z.record(z.string()).optional(),
});
export type Generate = z.infer<typeof Generate>;
