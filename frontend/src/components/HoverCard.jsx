import { motion } from 'framer-motion'

/** Shared card shell with a subtle hover lift, used across sections for consistent micro-interactions. */
export function HoverCard({ className = '', children, ...rest }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
