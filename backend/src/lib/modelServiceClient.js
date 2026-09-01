const TIMEOUT_MS = 5000;

function modelServiceUrl() {
  return process.env.MODEL_SERVICE_URL || 'http://localhost:8000';
}

/** Proxies a GET request to the model-service, forwarding query params. Throws on non-2xx or network failure. */
export async function callModelService(path, params = {}) {
  const url = new URL(path, modelServiceUrl());
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (cause) {
    throw Object.assign(new Error('Model service unreachable'), { cause });
  } finally {
    clearTimeout(timeout);
  }

  const body = await response.json().catch(() => undefined);
  if (!response.ok) {
    throw Object.assign(new Error('Model service rejected the request'), {
      status: response.status,
      body,
    });
  }
  return body;
}
