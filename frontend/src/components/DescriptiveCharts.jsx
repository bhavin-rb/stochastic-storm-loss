import { useMemo } from 'react'
import { HoverCard } from './HoverCard'
import { LazyPlotlyChart } from './LazyPlotlyChart'
import { ErrorState, LoadingState } from './AsyncState'
import { useDataSummary } from '../api/hooks'

/** Descriptive charts from /api/data/summary, reproducing thesis Figures 1, 2 and 4. */
export function DescriptiveCharts({ theme, threshold }) {
  const summary = useDataSummary()

  const frequencySeries = useMemo(() => {
    if (!summary.data) return []
    return [
      {
        x: summary.data.annual_frequency.years,
        y: summary.data.annual_frequency.counts,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Events per year',
        line: { color: '#0ea5e9' },
      },
    ]
  }, [summary.data])

  const severityHistogram = useMemo(() => {
    if (!summary.data) return []
    return [
      {
        x: summary.data.severity,
        type: 'histogram',
        name: 'Insured losses',
        marker: { color: '#0ea5e9' },
      },
    ]
  }, [summary.data])

  const mrlSeries = useMemo(() => {
    if (!summary.data) return []
    return [
      {
        x: summary.data.mean_residual_life.thresholds,
        y: summary.data.mean_residual_life.mean_excess,
        type: 'scatter',
        mode: 'lines',
        name: 'Mean excess',
        line: { color: '#0ea5e9' },
      },
    ]
  }, [summary.data])

  const mrlLayout = useMemo(
    () => ({
      xaxis: { title: { text: 'Threshold (USD)', standoff: 12 } },
      yaxis: { title: { text: 'Mean excess (USD)', standoff: 12 } },
      margin: { t: 40, r: 16, b: 64, l: 72 },
      shapes: threshold
        ? [
            {
              type: 'line',
              x0: threshold,
              x1: threshold,
              yref: 'paper',
              y0: 0,
              y1: 1,
              line: { color: '#f59e0b', dash: 'dot', width: 2 },
            },
          ]
        : [],
    }),
    [threshold],
  )

  if (summary.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-sm font-semibold">Dataset overview</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Server is warming up — first load can take up to a minute. Please wait.
        </p>
        <div className="mt-4 h-8">
          <LoadingState label="Loading dataset overview…" />
        </div>
      </div>
    )
  }
  if (summary.isError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-sm font-semibold">Dataset overview</p>
        <div className="mt-4 h-24">
          <ErrorState message={summary.error.message} onRetry={() => summary.refetch()} />
        </div>
      </div>
    )
  }
  if (!summary.data) return null

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <HoverCard>
        <h4 className="font-semibold">Annual storm frequency</h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Global storm events per year, 2000–2023.
        </p>
        <div className="mt-4 h-64">
          <LazyPlotlyChart
            theme={theme}
            data={frequencySeries}
            layout={{
              xaxis: { title: { text: 'Years', standoff: 12 } },
              yaxis: { title: { text: 'No. of Storms', standoff: 12 } },
              margin: { t: 40, r: 16, b: 64, l: 72 },
            }}
          />
        </div>
      </HoverCard>

      <HoverCard>
        <h4 className="font-semibold">Severity distribution</h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Insured losses (USD) across all 386 recorded events.
        </p>
        <div className="mt-4 h-64">
          <LazyPlotlyChart
            theme={theme}
            data={severityHistogram}
            layout={{
              xaxis: { title: { text: 'Insured loss (USD)', standoff: 12 } },
              yaxis: { title: { text: 'Count', standoff: 12 } },
              margin: { t: 40, r: 16, b: 64, l: 72 },
            }}
          />
        </div>
      </HoverCard>

      <HoverCard>
        <h4 className="font-semibold">Mean Residual Life</h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          GPD threshold diagnostic; dotted line marks the threshold selected above.
        </p>
        <div className="mt-4 h-64">
          <LazyPlotlyChart theme={theme} data={mrlSeries} layout={mrlLayout} />
        </div>
      </HoverCard>
    </div>
  )
}
