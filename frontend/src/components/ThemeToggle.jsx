import { motion } from 'framer-motion'

export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-lg transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      <motion.span
        aria-hidden="true"
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? '\u2600\uFE0F' : '\u{1F319}'}
      </motion.span>
    </motion.button>
  )
}
