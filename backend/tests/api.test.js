import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import request from 'supertest';
import { createApp } from '../src/app.js';

let mockModelService;

before(async () => {
  mockModelService = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('Content-Type', 'application/json');

    if (url.pathname === '/frequency/fit') {
      res.end(JSON.stringify({ model: url.searchParams.get('model'), mean: 104.58 }));
    } else if (url.pathname === '/severity/fit') {
      res.end(JSON.stringify({ threshold: Number(url.searchParams.get('threshold')), shape: 1.1018 }));
    } else if (url.pathname === '/pricing/pure-premium') {
      res.end(JSON.stringify({ pure_premium: null, is_infinite: true }));
    } else if (url.pathname === '/data/summary') {
      res.end(JSON.stringify({ annual_frequency: { years: [2000], counts: [90] } }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ detail: 'not found' }));
    }
  });
  await new Promise((resolve) => mockModelService.listen(0, resolve));
  process.env.MODEL_SERVICE_URL = `http://localhost:${mockModelService.address().port}`;
});

after(async () => {
  await new Promise((resolve) => mockModelService.close(resolve));
});

test('GET /api/health returns ok', async () => {
  const app = createApp();
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('GET /api/frequency proxies to model-service', async () => {
  const app = createApp();
  const response = await request(app).get('/api/frequency').query({ model: 'negbin' });
  assert.equal(response.status, 200);
  assert.equal(response.body.model, 'negbin');
});

test('GET /api/frequency rejects an invalid model without calling model-service', async () => {
  const app = createApp();
  const response = await request(app).get('/api/frequency').query({ model: 'bogus' });
  assert.equal(response.status, 400);
});

test('GET /api/severity proxies to model-service', async () => {
  const app = createApp();
  const response = await request(app).get('/api/severity').query({ threshold: 5_000_000 });
  assert.equal(response.status, 200);
  assert.equal(response.body.threshold, 5_000_000);
});

test('GET /api/severity rejects an out-of-range threshold', async () => {
  const app = createApp();
  const response = await request(app).get('/api/severity').query({ threshold: 1 });
  assert.equal(response.status, 400);
});

test('GET /api/pricing proxies to model-service', async () => {
  const app = createApp();
  const response = await request(app).get('/api/pricing').query({ threshold: 5_000_000, model: 'negbin' });
  assert.equal(response.status, 200);
  assert.equal(response.body.is_infinite, true);
});

test('GET /api/data/summary proxies to model-service', async () => {
  const app = createApp();
  const response = await request(app).get('/api/data/summary');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.annual_frequency.years, [2000]);
});

test('returns a clean 502 when the model-service is unreachable', async () => {
  const previousUrl = process.env.MODEL_SERVICE_URL;
  process.env.MODEL_SERVICE_URL = 'http://localhost:1';

  const app = createApp();
  const response = await request(app).get('/api/data/summary');
  assert.equal(response.status, 502);
  assert.equal(response.body.error, 'Model service unavailable');

  process.env.MODEL_SERVICE_URL = previousUrl;
});
