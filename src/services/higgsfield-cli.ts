import { spawn } from 'node:child_process';
import { config } from '../config.js';
import { HttpError } from '../lib/errors.js';

interface CliResult {
  stdout: string;
  stderr: string;
}

export async function runCli(args: string[]): Promise<CliResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(config.HIGGSFIELD_CLI_BIN, ['--json', ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const out: Buffer[] = [];
    const err: Buffer[] = [];
    child.stdout.on('data', (b: Buffer) => out.push(b));
    child.stderr.on('data', (b: Buffer) => err.push(b));
    child.on('error', reject);
    child.on('close', (code) => {
      const stdout = Buffer.concat(out).toString('utf8');
      const stderr = Buffer.concat(err).toString('utf8');
      if (code !== 0) {
        reject(
          new HttpError(502, 'cli_failed', stderr.slice(0, 500) || `exit ${code ?? 'null'}`),
        );
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

export async function runCliJson<T>(args: string[]): Promise<T> {
  const { stdout } = await runCli(args);
  try {
    return JSON.parse(stdout) as T;
  } catch {
    throw new HttpError(502, 'cli_invalid_json', stdout.slice(0, 500));
  }
}

export function flagsFromObject(obj: Record<string, unknown>): string[] {
  const out: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    const flag = `--${key}`;
    if (Array.isArray(value)) {
      for (const v of value) out.push(flag, String(v));
    } else if (typeof value === 'boolean') {
      if (value) out.push(flag);
    } else {
      out.push(flag, String(value));
    }
  }
  return out;
}
