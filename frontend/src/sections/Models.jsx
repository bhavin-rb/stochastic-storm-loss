import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DescriptiveCharts } from '../components/DescriptiveCharts'
import { FadeInSection } from '../components/FadeInSection'
import { HoverCard } from '../components/HoverCard'
import { LazyPlotlyChart } from '../components/LazyPlotlyChart'
import { SideImage } from '../components/SideImage'
import { useFrequencyFit, useSeverityFit } from '../api/hooks'
import { formatNumber } from '../lib/format'

const MIN_THRESHOLD = 100_000
const MAX_THRESHOLD = 50_000_000
const DEFAULT_THRESHOLD = 5_000_000

export function Models({ theme }) {
  const [model, setModel] = useState('negbin')
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD)
  const [debouncedThreshold, setDebouncedThreshold] = useState(DEFAULT_THRESHOLD)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedThreshold(threshold), 300)
    return () => clearTimeout(timeout)
  }, [threshold])

  const frequency = useFrequencyFit(model)
  const severity = useSeverityFit(debouncedThreshold)

  const frequencyChartData = useMemo(() => {
    if (!frequency.data) return []
    return [
      {
        x: frequency.data.event_range,
        y: frequency.data.observed_frequency,
        name: 'Observed',
        type: 'bar',
      },
      {
        x: frequency.data.event_range,
        y: frequency.data.expected_frequency,
        name: `Expected (${model === 'poisson' ? 'Poisson' : 'Negative Binomial'})`,
        type: 'bar',
      },
    ]
  }, [frequency.data, model])

  const severityChartData = useMemo(() => {
    if (!severity.data) return []
    return [
      {
        x: severity.data.exceedances,
        type: 'histogram',
        histnorm: 'probability density',
        name: 'Exceedances (observed)',
        opacity: 0.55,
        marker: { color: '#0ea5e9' },
      },
      {
        x: severity.data.pdf_x,
        y: severity.data.pdf_y,
        name: 'Fitted GPD density',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#f59e0b', width: 3 },
      },
    ]
  }, [severity.data])

  return (
    <section id="models" className="mx-auto max-w-6xl px-6 py-16">
      <SideImage
        src="/images/data_analysis_section_image.jpg"
        alt="Data analysis of storm severity"
        side="left"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Interactive Models</h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Interactive modelling allows users to explore the dynamics of storm risk in real time.
        </p>
        <ul className="mt-6 space-y-4">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Frequency selection:</strong>{' '}
              a preferred count distribution (e.g.,{' '}
              <strong className="font-medium">Poisson</strong> or{' '}
              <strong className="font-medium">Negative Binomial</strong>) can be chosen to represent
              storm occurrence.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Severity threshold adjustment:</strong>{' '}
              the loss threshold can be moved interactively, with fitted{' '}
              <strong className="font-medium">Extreme Value Theory (EVT)</strong> distributions
              updating live to reflect tail behavior.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Dynamic visualization:</strong>{' '}
              charts and curves refresh instantly through the model-service API, showing how frequency
              and severity interact under different parameter settings.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Applied insight:</strong>{' '}
              this interactivity demonstrates how actuarial assumptions influence the resulting pure
              premium, making the modelling process transparent and educational.
            </p>
          </li>
        </ul>
      </SideImage>

      <FadeInSection delay={0.1}>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <HoverCard>
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold">Frequency fit</h3>
              <div className="flex rounded-full border border-slate-300 p-1 text-sm dark:border-slate-700">
                {['negbin', 'poisson'].map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setModel(option)}
                    aria-pressed={model === option}
                    className={`rounded-full px-3 py-1 transition-colors ${
                      model === option
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {option === 'negbin' ? 'Negative Binomial' : 'Poisson'}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-4 h-72">
              {frequency.isLoading && <ChartPlaceholder label="Loading frequency fit…" />}
              {frequency.isError && <ChartError message={frequency.error.message} />}
              {frequency.data && (
                <LazyPlotlyChart
                  theme={theme}
                  data={frequencyChartData}
                  layout={{
                    barmode: 'group',
                    xaxis: { title: { text: 'Number of storms', standoff: 12 } },
                    yaxis: { title: { text: 'Frequency', standoff: 12 } },
                    margin: { t: 20, r: 16, b: 64, l: 72 },
                  }}
                />
              )}
            </div>

            {frequency.data && (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <Stat label="Mean" value={formatNumber(frequency.data.mean)} />
                <Stat
                  label="Dispersion index"
                  value={formatNumber(frequency.data.variance / frequency.data.mean)}
                />
                <Stat label="Chi-square" value={formatNumber(frequency.data.chi_square_statistic)} />
                <Stat label="p-value" value={formatNumber(frequency.data.p_value, 3)} />
              </dl>
            )}
          </HoverCard>

          <HoverCard>
            <h3 className="font-semibold">Severity fit (GPD)</h3>
            <label className="mt-4 block text-sm text-slate-600 dark:text-slate-300">
              Threshold: {formatNumber(threshold, 0)} USD
              <input
                type="range"
                min={MIN_THRESHOLD}
                max={MAX_THRESHOLD}
                step={100_000}
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
                className="mt-2 w-full accent-slate-900 dark:accent-white"
              />
            </label>

            <div className="mt-4 h-64">
              {severity.isLoading && <ChartPlaceholder label="Loading severity fit…" />}
              {severity.isError && <ChartError message={severity.error.message} />}
              {severity.data && (
                <LazyPlotlyChart
                  theme={theme}
                  data={severityChartData}
                  layout={{
                    xaxis: { title: { text: 'Excess Loss', standoff: 12 } },
                    yaxis: { title: { text: 'Density', standoff: 12 } },
                    margin: { t: 20, r: 16, b: 64, l: 72 },
                  }}
                />
              )}
            </div>

            {severity.data && (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <Stat label="Exceedances" value={severity.data.n_exceedances} />
                <Stat label="Shape (ξ)" value={formatNumber(severity.data.shape, 4)} />
                <Stat label="Scale (σ)" value={formatNumber(severity.data.scale, 0)} />
                <Stat
                  label="Expected severity"
                  value={severity.data.is_infinite ? 'Infinite' : formatNumber(severity.data.expected_severity, 0)}
                />
              </dl>
            )}
          </HoverCard>
        </div>
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <h3 className="mt-16 text-xl font-semibold">Dataset overview</h3>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Descriptive charts computed directly from the underlying dataset, independent of the model
          selection above.
        </p>
        <div className="mt-6">
          <DescriptiveCharts theme={theme} threshold={debouncedThreshold} />
        </div>
      </FadeInSection>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}

function ChartPlaceholder({ label }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
      {label}
    </div>
  )
}

function ChartError({ message }) {
  return (
    <div className="flex h-full items-center justify-center text-center text-sm text-red-600 dark:text-red-400">
      {message}
    </div>
  )
}
