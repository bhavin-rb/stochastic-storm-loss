import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#methodology', label: 'Methodology' },
  { href: '#models', label: 'Models' },
  { href: '#results', label: 'Results' },
  { href: '#about', label: 'About' },
]

export function Nav({ theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a href="#home" className="whitespace-nowrap font-semibold tracking-tight">
          Storm Loss Pricing
        </a>
        <ul className="flex items-center gap-4 overflow-x-auto text-sm font-medium text-slate-600 dark:text-slate-300">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="whitespace-nowrap decoration-2 underline-offset-4 transition-colors hover:text-slate-950 hover:underline dark:hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </nav>
    </header>
  )
}
