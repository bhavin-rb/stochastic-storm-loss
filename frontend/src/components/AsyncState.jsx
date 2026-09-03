/**
 * Shared loading/error UI for async chart and stat sections.
 * Cold starts on a sleep-prone host can take tens of seconds, so a plain "loading"
 * label can feel like the app is broken. These states make the wait feel intentional
 * and give the user an explicit way to retry a failed request.
 */
export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex h-full items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500 dark:border-slate-600 dark:border-t-slate-300" />
      <span>{label}</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      {typeof onRetry === 'function' && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Retry
        </button>
      )}
    </div>
  )
}