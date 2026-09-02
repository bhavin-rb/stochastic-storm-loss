import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function Home() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[92svh] items-center overflow-hidden py-20"
    >
      <motion.img
        src="/images/hero_image.jpg"
        alt=""
        style={{ y }}
        className="absolute inset-0 h-[130%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-white dark:to-slate-950" />

      <motion.div
        style={{ opacity }}
        className="relative mx-auto max-w-4xl px-6 text-center text-white"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-200"
        >
          Frequency-Severity Analysis for Insurance Pricing
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl font-bold tracking-tight sm:text-6xl"
        >
          Stochastic Modelling of Catastrophic Storm Losses
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-base text-slate-200 sm:mt-5 sm:text-lg"
        >
          An interactive exploration of 2,510 global storm events (2000–2023): fitting
          frequency and severity models, and pricing the resulting pure premium.
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          href="#methodology"
          className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition-transform hover:scale-105"
        >
          Explore the Analysis
        </motion.a>
      </motion.div>
    </section>
  )
}
