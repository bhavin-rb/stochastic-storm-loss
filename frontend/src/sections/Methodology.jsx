import { BlockMath, InlineMath } from 'react-katex'
import { FadeInSection } from '../components/FadeInSection'
import { HoverCard } from '../components/HoverCard'
import { SideImage } from '../components/SideImage'

const CARDS = [
  {
    title: 'Data Source',
    body: `The dataset is drawn from EM-DAT, filtered to global storm events (all subtypes — tropical
      cyclones, severe weather, blizzards, tornadoes, hail, and more) between 2000 and 2023,
      yielding 2,510 events. Severity uses insured damages only — the losses insurers actually
      carry — not total economic damage.`,
  },
  {
    title: 'Selection Criteria & Variables',
    body: `Frequency is modelled as annual event counts (24 yearly observations). Severity uses the
      386 events with non-null insured damage. Both variables are analysed independently, then
      combined into a single pure premium estimate.`,
  },
]

export function Methodology() {
  return (
    <section id="methodology" className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
      <SideImage
        src="/images/methodology_section_image.jpg"
        alt="Storm damage with insured loss methodology"
        side="right"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Methodology</h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          A <strong className="font-semibold text-slate-900 dark:text-white">frequency-severity
          approach</strong> is applied to quantify catastrophic storm losses for insurance pricing.
        </p>
        <ul className="mt-6 space-y-4">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Frequency modelling:</strong>{' '}
              estimate how often storms occur in a given year using count distributions such as{' '}
              <strong className="font-medium">Poisson</strong> and{' '}
              <strong className="font-medium">Negative Binomial</strong>. This captures the
              stochastic nature of event occurrence.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Severity modelling:</strong>{' '}
              measure the size of insured losses per storm using{' '}
              <strong className="font-medium">Extreme Value Theory (EVT)</strong>, particularly the{' '}
              <strong className="font-medium">Generalized Pareto Distribution (GPD)</strong>, to
              account for heavy-tailed loss behavior.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Integration:</strong>{' '}
              combine frequency and severity results to calculate the{' '}
              <strong className="font-medium">pure premium</strong>, representing the expected
              annual loss cost.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">Data foundation:</strong>{' '}
              all modelling is grounded in the <strong className="font-medium">EM-DAT</strong>{' '}
              dataset, which provides historical records of storm events and associated losses.
            </p>
          </li>
        </ul>
      </SideImage>

      <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-2">
        {CARDS.map((card, i) => (
          <FadeInSection key={card.title} delay={i * 0.1}>
            <HoverCard className="h-full">
              <h3 className="font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {card.body}
              </p>
            </HoverCard>
          </FadeInSection>
        ))}
      </div>

      <FadeInSection delay={0.2}>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold">Frequency: Poisson vs. Negative Binomial</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            The Poisson distribution assumes the mean equals the variance:
          </p>
          <BlockMath math={'P(N = n) = \\dfrac{\\lambda^{n} e^{-\\lambda}}{n!}'} />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Annual storm counts are overdispersed (variance far exceeds the mean), so the Poisson
            fit is rejected by a chi-squared goodness-of-fit test. A Negative Binomial, fit by the
            method of moments, is used instead:
          </p>
          <BlockMath math={'p = \\dfrac{\\bar{x}}{s^{2}}, \\qquad r = \\dfrac{\\bar{x}^{2}}{s^{2} - \\bar{x}}'} />
        </div>
      </FadeInSection>

      <FadeInSection delay={0.3}>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold">Severity: Generalized Pareto Distribution</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Above a chosen threshold, exceedances of insured losses are modelled with a GPD (shape
            <InlineMath math={'\\xi'} />, scale <InlineMath math={'\\sigma'} />, free location),
            following the Peaks-Over-Threshold approach:
          </p>
          <BlockMath math={'F(x) = 1 - \\left(1 + \\dfrac{\\xi x}{\\sigma}\\right)^{-1/\\xi}'} />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            The expected severity is finite only when <InlineMath math={'\\xi < 1'} />:
          </p>
          <BlockMath math={'E[Y] = \\dfrac{\\sigma}{1 - \\xi}, \\qquad \\xi < 1'} />
        </div>
      </FadeInSection>

      <FadeInSection delay={0.4}>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold">Pure Premium</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            The frequency and severity models combine into a single pure premium estimate:
          </p>
          <BlockMath math={'\\text{Pure Premium} = E[N] \\times E[Y]'} />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            At this dataset&apos;s default threshold, the fitted shape parameter is{' '}
            <InlineMath math={'\\xi \\approx 1.10 \\geq 1'} />, so expected severity — and
            therefore the pure premium — is genuinely infinite. This is the thesis&apos;s own
            finding, not an error, and motivates risk measures such as VaR or CTE as future work.
          </p>
        </div>
      </FadeInSection>
    </section>
  )
}
