import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { callModelService } from '../lib/modelServiceClient.js';
import { validateQuery, frequencyQuerySchema, severityQuerySchema, pricingQuerySchema } from '../validation.js';

const router = Router();

// Model fits are CPU-bound on the model-service, so cap how often clients can trigger them.
const modelFitLimiter = rateLimit({
  windowMs: 60_000,
  limit: Number(process.env.RATE_LIMIT_MAX) || 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/frequency', modelFitLimiter, validateQuery(frequencyQuerySchema), async (req, res, next) => {
  try {
    res.json(await callModelService('/frequency', req.validatedQuery));
  } catch (err) {
    next(err);
  }
});

router.get('/severity', modelFitLimiter, validateQuery(severityQuerySchema), async (req, res, next) => {
  try {
    res.json(await callModelService('/severity', req.validatedQuery));
  } catch (err) {
    next(err);
  }
});

router.get('/pricing', modelFitLimiter, validateQuery(pricingQuerySchema), async (req, res, next) => {
  try {
    res.json(await callModelService('/pricing', req.validatedQuery));
  } catch (err) {
    next(err);
  }
});

router.get('/data/summary', async (req, res, next) => {
  try {
    res.json(await callModelService('/data/summary'));
  } catch (err) {
    next(err);
  }
});

export default router;
