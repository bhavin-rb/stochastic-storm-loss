/** Maps model-service failures to a clean JSON error, never leaking stack traces. */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (res.headersSent) return next(err);

  console.error(err.message);

  if (err.status) {
    return res.status(err.status).json({
      error: 'Model service rejected the request',
      details: err.body?.detail,
    });
  }

  res.status(502).json({ error: 'Model service unavailable' });
}
