import { z } from 'zod';

const MIN_THRESHOLD = 100_000;
const MAX_THRESHOLD = 50_000_000;
const DEFAULT_THRESHOLD = 5_000_000;

const frequencyModel = z.enum(['poisson', 'negbin']).default('negbin');
const threshold = z.coerce.number().min(MIN_THRESHOLD).max(MAX_THRESHOLD).default(DEFAULT_THRESHOLD);

export const frequencyQuerySchema = z.object({ model: frequencyModel });
export const severityQuerySchema = z.object({ threshold });
export const pricingQuerySchema = z.object({ threshold, model: frequencyModel });

/** Validates and coerces req.query against a zod schema, storing the result on req.validatedQuery. */
export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: result.error.flatten().fieldErrors,
      });
    }
    req.validatedQuery = result.data;
    next();
  };
}
