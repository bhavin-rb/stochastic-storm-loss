import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Nav } from '../components/Nav'

describe('Nav', () => {
  it('renders all section anchor links and the theme toggle', () => {
    render(<Nav theme="dark" onToggleTheme={vi.fn()} />)

    for (const label of ['Home', 'Methodology', 'Models', 'Results', 'About']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }

    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument()
  })
})
