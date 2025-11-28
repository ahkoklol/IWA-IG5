// src/components/gatewayTest.ts
import * as SecureStore from 'expo-secure-store';

export type GatewayTestResult = {
  status: number;
  ok: boolean;
  text: string | null;
};

const GATEWAY_BASE = process.env.EXPO_PUBLIC_GATEWAY_URL ?? 'http://localhost:8090';

type TestOptions = {
  includeAuth?: boolean;       // attach Authorization header from SecureStore if available
  logFull?: boolean;           // log full request/response bodies (dangerous for tokens / large payloads)
  maxBodyLogLength?: number;   // number of chars to keep when logFull=false
};

function redactHeaders(headers: Record<string, string | undefined>) {
  const copy: Record<string, string | undefined> = { ...headers };
  if (copy.Authorization) copy.Authorization = 'REDACTED';
  if (copy.authorization) copy.authorization = 'REDACTED';
  return copy;
}

export async function testGateway(
  path = '/',
  init?: RequestInit,
  options: TestOptions = {}
): Promise<GatewayTestResult> {
  const { includeAuth = false, logFull = false, maxBodyLogLength = 1000 } = options;
  const url = `${GATEWAY_BASE}${path}`;
  const opts: RequestInit = { method: 'GET', ...init };

  try {
    // attach Authorization header when requested
    if (includeAuth) {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        opts.headers = {
          ...(opts.headers as Record<string, string> | undefined),
          Authorization: `Bearer ${token}`,
        };
      }
    }

    // Prepare request log (redact token)
    const reqHeaders = (opts.headers && typeof opts.headers === 'object')
      ? redactHeaders(opts.headers as Record<string, string | undefined>)
      : opts.headers;

    // Read request body (if any) for logging
    let reqBodyPreview: string | null = null;
    if (opts.body != null) {
      try {
        // body is often stringified JSON or FormData; convert safely
        if (typeof opts.body === 'string') {
          reqBodyPreview = opts.body;
        } else if (opts.body instanceof URLSearchParams) {
          reqBodyPreview = opts.body.toString();
        } else {
          // attempt to JSON.stringify other shapes
          reqBodyPreview = JSON.stringify(opts.body);
        }
      } catch (e) {
        reqBodyPreview = '[unserializable request body]';
      }
    }

    console.log('[testGateway] Request ->', {
      url,
      method: opts.method,
      headers: reqHeaders,
      body: logFull ? reqBodyPreview : reqBodyPreview ? reqBodyPreview.slice(0, maxBodyLogLength) : null,
    });

    const started = Date.now();
    const res = await fetch(url, opts);
    const durationMs = Date.now() - started;

    // collect response headers
    const responseHeaders: Record<string, string> = {};
    try {
      // fetch Headers supports forEach in RN/Expo
      res.headers.forEach((value: string, name: string) => {
        responseHeaders[name] = value;
      });
    } catch (e) {
      // fallback: can't enumerate headers reliably
    }

    // read response body as text (may be large)
    let text: string | null = null;
    try {
      text = await res.text();
    } catch (e) {
      text = '[failed to read response text]';
    }

    // log response (redact sensitive parts from headers)
    console.log('[testGateway] Response <-', {
      url,
      status: res.status,
      ok: res.ok,
      durationMs,
      headers: redactHeaders(responseHeaders),
      body: logFull ? text : text ? text.slice(0, maxBodyLogLength) : null,
    });

    return { status: res.status, ok: res.ok, text };
  } catch (err) {
    console.log('[testGateway] fetch error', err);
    return { status: 0, ok: false, text: String(err) };
  }
}