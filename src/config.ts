import { z } from 'zod';

const Schema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HIGGSFIELD_RESOURCE_URL: z.string().url().default('https://mcp.higgsfield.ai'),
  HIGGSFIELD_OAUTH_CLIENT_ID: z.string().min(1).optional(),
  HIGGSFIELD_CLI_BIN: z.string().default('higgsfield'),
});

export type Config = z.infer<typeof Schema>;

export const config: Config = Schema.parse(process.env);
