type LogContext = Record<string, unknown>;

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const candidate = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
    const parts = [candidate.message, candidate.details, candidate.hint, candidate.code]
      .filter((value): value is string => typeof value === 'string' && value.length > 0);
    if (parts.length) return parts.join(' · ');
    try { return JSON.stringify(error); } catch { return 'Unknown error'; }
  }
  return 'Unknown error';
}

export function logClientError(error: unknown, context: LogContext = {}) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[5days]', getErrorMessage(error), context);
  }
  // Keep this boundary ready for Sentry or another remote sink.
  // Do not send secrets, tokens, or full device state here.
}
