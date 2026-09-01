import { Nav } from './components/Nav'
import { useTheme } from './hooks/useTheme'
import { Home } from './sections/Home'
import { Methodology } from './sections/Methodology'
import { Models } from './sections/Models'
import { Results } from './sections/Results'
import { About } from './sections/About'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Home />
        <Methodology />
        <Models theme={theme} />
        <Results theme={theme} />
        <About />
      </main>
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Built as an interactive companion to a Bachelor thesis on catastrophic storm loss modelling.
      </footer>
    </div>
  )
}

export default App
