import { useState } from 'react'
import { motion } from 'framer-motion'
import { FadeInSection } from '../components/FadeInSection'
import { HoverCard } from '../components/HoverCard'
import { LazyPlotlyChart } from '../components/LazyPlotlyChart'
import { SideImage } from '../components/SideImage'
import { usePurePremium, useSeverityFit } from '../api/hooks'
import { formatCurrency, formatNumber } from '../lib/format'

const DEFAULT_THRESHOLD = 5_000_000

export function Results({ theme }) {
  const [model, setModel] = useState('negbin')
  const [showExplanation, setShowExplanation] = useState(false)
  const pricing = usePurePremium(DEFAULT_THRESHOLD, model)
  const severity = useSeverityFit(DEFAULT_THRESHOLD)

  const qqData =
    severity.data && (() => {
      const minX = Math.min(...severity.data.qq_theoretical)
      const maxX = Math.max(...severity.data.qq_theoretical)
      return [
        {
          x: [minX, maxX],
          y: [minX, maxX],
          mode: 'lines',
          type: 'scatter',
          name: 'Reference (y=x)',
          line: { color: '#ef4444', width: 2, dash: 'dash' },
          showlegend: false,
        },
        {
          x: severity.data.qq_theoretical,
          y: severity.data.qq_empirical,
          mode: 'markers',
          type: 'scatter',
          name: 'Exceedances',
        },
      ]
    })()

  return (
    <section id="results" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-10 sm:py-16">
      <SideImage
        src="/images/conclusion_section_image.jpg"
        alt="Conclusion summarizing model outcomes"
        side="right"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Results</h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          By combining the fitted frequency and severity models at the dataset&apos;s default{' '}
          <strong className="font-semibold text-slate-900 dark:text-white">$5,000,000 threshold</strong>,
          the following outcomes are observed:
        </p>
        <ul className="mt-6 space-y-4">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Frequency outcomes:</strong>{' '}
              the <strong className="font-medium">Poisson model</strong> provides a baseline estimate
              of annual storm counts, while the <strong className="font-medium">Negative Binomial
              model</strong> captures over-dispersion present in the historical data.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Severity outcomes:</strong>{' '}
              loss magnitudes above the threshold are well-represented by the{' '}
              <strong className="font-medium">Generalized Pareto Distribution (GPD)</strong>,
              reflecting the heavy-tailed nature of catastrophic events.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Integrated premium:</strong>{' '}
              the joint frequency–severity framework yields an expected annual{' '}
              <strong className="font-medium">pure premium</strong>, quantifying the average insured
              loss cost under stochastic assumptions.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Model comparison:</strong>{' '}
              results highlight differences in premium estimates depending on the chosen frequency
              distribution, underscoring the importance of model selection in actuarial practice.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Data grounding:</strong>{' '}
              all results are derived directly from the <strong className="font-medium">EM-DAT</strong>{' '}
              dataset, ensuring reproducibility and alignment with the methodology.
            </p>
          </li>
        </ul>
      </SideImage>

      <FadeInSection delay={0.1}>
        <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-2">
          <HoverCard>
            <div className="flex flex-wrap items-center justify-between gap-3">
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

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowExplanation((prev) => !prev)}
                  aria-expanded={showExplanation}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300 px-4 py-1.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-950"
                >
                  {showExplanation ? 'Hide Explanation' : 'Reveal Explanation'}
                </motion.button>

                {showExplanation && (
                  <div className="mt-4 space-y-3 border-t border-amber-300 pt-4 text-amber-900 dark:border-amber-700 dark:text-amber-100">
                    <p className="text-sm leading-relaxed">
                      At the dataset&apos;s default{' '}
                      <strong className="font-semibold">$5,000,000 threshold</strong>, the fitted{' '}
                      <strong className="font-semibold">Generalized Pareto Distribution (GPD)</strong>{' '}
                      produces a shape parameter ({'\u03be'}) greater than or equal to 1.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <p className="text-sm leading-relaxed">
                          <strong className="font-semibold">Interpretation:</strong> When {'\u03be'} ≥ 1, the
                          expected severity becomes mathematically infinite. This reflects the heavy-tailed
                          nature of catastrophic storm losses, where extreme events dominate the distribution.
                        </p>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <p className="text-sm leading-relaxed">
                          <strong className="font-semibold">Implication:</strong> Because the mean loss is
                          undefined, the <strong className="font-medium">pure premium cannot be computed in
                          finite terms</strong>. This was a major conclusion of the project: traditional
                          actuarial models break down under heavy-tailed catastrophe risk.
                        </p>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <p className="text-sm leading-relaxed">
                          <strong className="font-semibold">Frequency context:</strong> The expected
                          frequency remains finite (≈104.6 events), but combining it with infinite severity
                          yields an undefined premium.
                        </p>
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <p className="text-sm leading-relaxed">
                          <strong className="font-semibold">Significance:</strong> This result highlights the
                          need for alternative approaches such as{' '}
                          <strong className="font-medium">tail risk measures (e.g., Value-at-Risk,
                          Conditional Tail Expectation)</strong> or{' '}
                          <strong className="font-medium">reinsurance structures</strong>, rather than
                          relying solely on expected values.
                        </p>
                      </li>
                    </ul>
                  </div>
                )}
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
                  layout={{
                    xaxis: { title: { text: 'Theoretical quantiles', standoff: 12 } },
                    yaxis: { title: { text: 'Empirical quantiles', standoff: 12 } },
                    legend: {
                      orientation: 'h',
                      y: 1.0,
                      x: 0,
                      xanchor: 'left',
                      yanchor: 'bottom',
                    },
                    margin: { t: 64, r: 16, b: 64, l: 72 },
                  }}
                />
              )}
            </div>
          </HoverCard>
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
