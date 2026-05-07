import { config } from '../config.js';
import { HttpError } from '../lib/errors.js';

interface ProtectedResource {
  resource: string;
  authorization_servers?: string[];
}

interface AuthServerMetadata {
  issuer: string;
  device_authorization_endpoint?: string;
  token_endpoint: string;
  registration_endpoint?: string;
  grant_types_supported?: string[];
}

export interface DeviceAuthorization {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete?: string;
  expires_in: number;
  interval: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

export type PollResult =
  | { status: 'pending'; error: 'authorization_pending' | 'slow_down' }
  | { status: 'token'; token: TokenResponse }
  | { status: 'error'; error: string };

let cachedMetadata: AuthServerMetadata | null = null;

async function discover(): Promise<AuthServerMetadata> {
  if (cachedMetadata) return cachedMetadata;
  const resourceUrl = `${config.HIGGSFIELD_RESOURCE_URL}/.well-known/oauth-protected-resource`;
  const resourceRes = await fetch(resourceUrl);
  if (!resourceRes.ok) {
    throw new HttpError(502, 'discovery_failed', `protected-resource ${resourceRes.status}`);
  }
  const resource = (await resourceRes.json()) as ProtectedResource;
  const issuer = resource.authorization_servers?.[0];
  if (!issuer) {
    throw new HttpError(502, 'discovery_failed', 'no authorization_servers advertised');
  }
  const asUrl = `${issuer.replace(/\/$/, '')}/.well-known/oauth-authorization-server`;
  const asRes = await fetch(asUrl);
  if (!asRes.ok) {
    throw new HttpError(502, 'discovery_failed', `auth-server ${asRes.status}`);
  }
  cachedMetadata = (await asRes.json()) as AuthServerMetadata;
  return cachedMetadata;
}

function requireClientId(): string {
  const clientId = config.HIGGSFIELD_OAUTH_CLIENT_ID;
  if (!clientId) {
    throw new HttpError(500, 'config_missing', 'HIGGSFIELD_OAUTH_CLIENT_ID is not set');
  }
  return clientId;
}

export async function startDeviceFlow(scope?: string): Promise<DeviceAuthorization> {
  const meta = await discover();
  if (!meta.device_authorization_endpoint) {
    throw new HttpError(501, 'not_supported', 'authorization server does not advertise device flow');
  }
  const clientId = requireClientId();
  const body = new URLSearchParams({ client_id: clientId });
  if (scope) body.set('scope', scope);
  const res = await fetch(meta.device_authorization_endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new HttpError(502, 'device_authorization_failed', text.slice(0, 200));
  }
  return (await res.json()) as DeviceAuthorization;
}

export async function pollToken(deviceCode: string): Promise<PollResult> {
  const meta = await discover();
  const clientId = requireClientId();
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    device_code: deviceCode,
    client_id: clientId,
  });
  const res = await fetch(meta.token_endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (res.ok && typeof json.access_token === 'string') {
    return { status: 'token', token: json as unknown as TokenResponse };
  }
  const err = typeof json.error === 'string' ? json.error : 'unknown_error';
  if (err === 'authorization_pending' || err === 'slow_down') {
    return { status: 'pending', error: err };
  }
  return { status: 'error', error: err };
}

export function resetDiscoveryCache(): void {
  cachedMetadata = null;
}
