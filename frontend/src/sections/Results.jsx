import { useState } from 'react'
import { motion } from 'framer-motion'
import { FadeInSection } from '../components/FadeInSection'
import { HoverCard } from '../components/HoverCard'
import { LazyPlotlyChart } from '../components/LazyPlotlyChart'
import { usePurePremium, useSeverityFit } from '../api/hooks'
import { formatCurrency, formatNumber } from '../lib/format'

const DEFAULT_THRESHOLD = 5_000_000

export function Results({ theme }) {
  const [model, setModel] = useState('negbin')
  const pricing = usePurePremium(DEFAULT_THRESHOLD, model)
  const severity = useSeverityFit(DEFAULT_THRESHOLD)

  const qqData =
    severity.data &&
    [
      {
        x: severity.data.qq_theoretical,
        y: severity.data.qq_empirical,
        mode: 'markers',
        type: 'scatter',
        name: 'Exceedances',
      },
    ]

  return (
    <section id="results" className="mx-auto max-w-6xl px-6 py-24">
      <FadeInSection>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Results</h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Combining the fitted frequency and severity models at the dataset&apos;s default
          $5,000,000 threshold.
        </p>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <HoverCard>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Pure Premium</h3>
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

            {pricing.isLoading && (
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Computing…</p>
            )}
            {pricing.isError && (
              <p className="mt-6 text-sm text-red-600 dark:text-red-400">{pricing.error.message}</p>
            )}
            {pricing.data && pricing.data.is_infinite && (
              <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/40">
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">Infinite / Undefined</p>
                <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">{pricing.data.reason}</p>
              </div>
            )}
            {pricing.data && !pricing.data.is_infinite && (
              <p className="mt-6 text-4xl font-bold">{formatCurrency(pricing.data.pure_premium)}</p>
            )}

            {pricing.data && (
              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Stat label="Expected frequency" value={formatNumber(pricing.data.expected_frequency)} />
                <Stat
                  label="Expected severity"
                  value={pricing.data.is_infinite ? 'Infinite' : formatCurrency(pricing.data.expected_severity)}
                />
              </dl>
            )}
          </HoverCard>

          <HoverCard>
            <h3 className="font-semibold">Q-Q Plot (GPD fit diagnostic)</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Good fit in low/mid quantiles; drifts at the extreme tail, as expected.
            </p>
            <div className="mt-4 h-72">
              {severity.isLoading && (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  Loading…
                </div>
              )}
              {qqData && (
                <LazyPlotlyChart
                  theme={theme}
                  data={qqData}
                  layout={{ xaxis: { title: 'Theoretical quantiles' }, yaxis: { title: 'Empirical quantiles' } }}
                />
              )}
            </div>
          </HoverCard>
        </div>
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <img
          src="/images/conclusion_section_image.jpg"
          alt=""
          className="mt-10 h-56 w-full rounded-2xl object-cover sm:h-72"
        />
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
