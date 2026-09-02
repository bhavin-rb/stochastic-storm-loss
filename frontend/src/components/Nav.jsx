import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#methodology', label: 'Methodology' },
  { href: '#models', label: 'Models' },
  { href: '#results', label: 'Results' },
  { href: '#about', label: 'About' },
]

function Hamburger({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 md:hidden"
    >
      <span className="flex flex-col gap-1.5">
        <motion.span
          className="block h-0.5 w-4 bg-slate-900 dark:bg-slate-100"
          animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="block h-0.5 w-4 bg-slate-900 dark:bg-slate-100"
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className="block h-0.5 w-4 bg-slate-900 dark:bg-slate-100"
          animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
        />
      </span>
    </button>
  )
}

export function Nav({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    for (const link of LINKS) {
      const el = document.querySelector(link.href)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setActive(href)
    setOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 320)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a href="#home" className="whitespace-nowrap font-semibold tracking-tight">
          Storm Loss Pricing
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? 'true' : undefined}
                className={`whitespace-nowrap decoration-2 underline-offset-4 transition-colors hover:text-slate-950 hover:underline dark:hover:text-white ${
                  active === link.href ? 'text-slate-950 underline dark:text-white' : ''
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: theme toggle always visible, hamburger on mobile */}
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Hamburger open={open} onClick={() => setOpen((prev) => !prev)} />
        </div>
      </nav>

      {/* Mobile dropdown — always in DOM, toggled via max-height CSS transition */}
      <div
        className={`overflow-hidden border-t border-slate-200 bg-white transition-[max-height,opacity] duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950 md:hidden ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-3">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
