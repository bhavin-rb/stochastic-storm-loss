import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from '../hooks/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to dark and applies the dark class', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles theme and persists it to localStorage', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.toggleTheme())

    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('theme')).toBe('light')
  })

  it('reads a previously persisted theme on mount', () => {
    window.localStorage.setItem('theme', 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })
})
