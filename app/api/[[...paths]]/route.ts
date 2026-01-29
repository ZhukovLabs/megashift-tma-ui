import {NextRequest, NextResponse} from 'next/server';
import {isValid} from "@tma.js/init-data-node";

type RouteParams = {
    params: Promise<{ paths?: string[] }>;
};

const HOP_BY_HOP_HEADERS = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailers',
    'transfer-encoding',
    'upgrade',
    'host',
    'content-length',
]);

/**
 * Нормализует строку SERVER в полноценный URL.
 * - добавляет http:// если схема отсутствует
 * - валидирует URL
 * - возвращает объект URL
 */
function normalizeServerRaw(raw?: string): URL {
    const original = raw ?? '';
    const trimmed = original.trim();

    if (!trimmed) {
        throw new Error('SERVER env is empty');
    }

    const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed);
    const candidate = hasScheme ? trimmed : `http://${trimmed}`;

    let parsed: URL;
    try {
        parsed = new URL(candidate);
    } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        throw new Error(`Invalid SERVER value "${original}": ${err}`);
    }

    if (!parsed.hostname) {
        throw new Error(`Invalid SERVER value, missing hostname: "${original}"`);
    }

    return parsed;
}

function buildTargetUrl(serverUrl: URL, paths: string[], originalRequestUrl: string): URL {
    console.log('[proxy] buildTargetUrl input:', {serverUrl: serverUrl.toString(), paths, originalRequestUrl});

    const basePath = (serverUrl.pathname || '').replace(/\/$/, '');

    const target = new URL(serverUrl.origin);
    target.pathname = basePath || '/';

    const cleanedSegments = paths
        .filter(Boolean)
        .map((p) => String(p).replace(/^\/+|\/+$/g, ''))
        .map((seg) => encodeURIComponent(seg));

    target.pathname = [basePath, ...cleanedSegments].filter(Boolean).join('/') || '/';

    const original = new URL(originalRequestUrl);
    target.search = original.search;

    console.log('[proxy] buildTargetUrl result:', target.toString());
    return target;
}

async function proxyRequest(request: NextRequest, paths: string[]): Promise<NextResponse> {
    const reqId = crypto.randomUUID();
    const start = Date.now();

    console.log('AUTH', request.headers.get('Authorization'));

    const token = request.headers.get('Authorization')!.replace(/^tma\s/, '');
    console.log(token);
    console.log('isValid', isValid(token, process.env.BOT_TOKEN!, {
        expiresIn: 31622400
    })) ;
    console.log(process.env.BOT_TOKEN)

    try {
        console.log(`\n=== [proxy:${reqId}] Incoming request ===`);
        console.log('[proxy] method:', request.method);
        console.log('[proxy] url:', request.url);
        console.log('[proxy] paths:', paths);

        let serverUrl: URL;
        try {
            serverUrl = normalizeServerRaw(process.env.SERVER);
            console.log('[proxy] normalized SERVER:', serverUrl.toString());
        } catch (e) {
            console.error('[proxy] SERVER normalization failed:', e);
            return NextResponse.json(
                {error: 'Invalid SERVER env', message: e instanceof Error ? e.message : String(e)},
                {status: 500}
            );
        }

        const targetUrl = buildTargetUrl(serverUrl, paths, request.url);

        const headers = new Headers();
        for (const [key, value] of request.headers) {
            if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) continue;
            headers.append(key, value);
        }
        headers.set('x-proxied-by', 'next-proxy');

        console.log('[proxy] forwarded headers keys:', Array.from(headers.keys()));

        const method = request.method.toUpperCase();
        const init: RequestInit = {
            method,
            headers,
            redirect: 'manual',
            signal: request.signal,
        };

        if (method !== 'GET' && method !== 'HEAD') {
            init.body = request.body;
            // @ts-expect-error node fetch duplex
            init.duplex = 'half';
        }

        console.log('[proxy] fetch init summary:', {
            method,
            target: targetUrl.toString(),
            hasBody: !!request.body,
        });

        const upstream = await fetch(targetUrl.toString(), init);

        console.log(`[proxy:${reqId}] upstream response`, {
            status: upstream.status,
            statusText: upstream.statusText,
            timeMs: Date.now() - start,
        });

        const responseHeaders = new Headers();
        for (const [key, value] of upstream.headers) {
            if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) continue;
            responseHeaders.append(key, value);
        }

        return new NextResponse(upstream.body, {
            status: upstream.status,
            statusText: upstream.statusText,
            headers: responseHeaders,
        });
    } catch (err) {
        console.error(`\n🔥 [proxy:${reqId}] ERROR`);
        console.error('Error object:', err);
        console.error('Error message:', err instanceof Error ? err.message : String(err));
        console.error('Stack:', err instanceof Error ? err.stack : 'no stack');
        console.error('SERVER env:', process.env.SERVER);
        console.error('Request URL:', request.url);
        console.error('Paths:', paths);

        return NextResponse.json(
            {
                error: 'Failed to proxy request',
                reqId,
                message: err instanceof Error ? err.message : String(err),
            },
            {status: 500}
        );
    }
}

async function handler(request: NextRequest, {params}: RouteParams) {
    const {paths} = await params;
    return proxyRequest(request, paths ?? []);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
