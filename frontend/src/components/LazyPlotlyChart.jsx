import { lazy, Suspense } from 'react'

const LazyChart = lazy(() =>
  import('./PlotlyChart').then((module) => ({ default: module.PlotlyChart })),
)

/** Code-split wrapper around PlotlyChart — plotly.js is the heaviest dependency in the bundle. */
export function LazyPlotlyChart(props) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          Loading chart…
        </div>
      }
    >
      <LazyChart {...props} />
    </Suspense>
  )
}
