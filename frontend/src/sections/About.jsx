import { FadeInSection } from '../components/FadeInSection'
import { AUTHOR_NAME, LINKEDIN_URL, THESIS_TITLE, UNIVERSITY_NAME } from '../siteConfig'

export function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-24">
      <FadeInSection>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <img src="/images/about_section_image.jpg" alt="" className="h-56 w-full object-cover sm:h-72" />
          <div className="p-6 sm:p-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About this project</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              This application turns the Bachelor thesis <em>&ldquo;{THESIS_TITLE}&rdquo;</em>{' '}
              into an interactive tool for exploring frequency-severity storm loss modelling and
              insurance pricing.
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Author</dt>
                <dd className="font-semibold">{AUTHOR_NAME}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">University</dt>
                <dd className="font-semibold">{UNIVERSITY_NAME}</dd>
              </div>
            </dl>

            <div className="mt-6">
              {LINKEDIN_URL ? (
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-slate-900"
                >
                  Connect on LinkedIn
                </a>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add your LinkedIn profile URL in <code>src/siteConfig.js</code>.
                </p>
              )}
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  )
}
