import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from '../components/ThemeToggle'

describe('ThemeToggle', () => {
  it('shows a pressed state and label for dark theme, and calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<ThemeToggle theme="dark" onToggle={onToggle} />)

    const button = screen.getByRole('button', { name: /switch to light theme/i })
    expect(button).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(button)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows the light-theme label when theme is light', () => {
    render(<ThemeToggle theme="light" onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
