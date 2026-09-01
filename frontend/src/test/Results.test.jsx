import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Results } from '../sections/Results'
import * as hooks from '../api/hooks'

vi.mock('../components/LazyPlotlyChart', () => ({
  LazyPlotlyChart: () => <div data-testid="plotly-chart" />,
}))

describe('Results section', () => {
  it('shows the infinite/undefined pure premium case with its reason', () => {
    vi.spyOn(hooks, 'usePurePremium').mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        pure_premium: null,
        is_infinite: true,
        reason: 'Expected severity is infinite because xi >= 1.',
        expected_frequency: 104.58,
        expected_severity: null,
      },
    })
    vi.spyOn(hooks, 'useSeverityFit').mockReturnValue({
      isLoading: false,
      data: {
        n_exceedances: 19,
        shape: 1.1018,
        scale: 8_162_979.71,
        is_infinite: true,
        expected_severity: null,
        qq_theoretical: [1, 2, 3],
        qq_empirical: [1, 2, 3],
      },
    })

    render(<Results theme="dark" />)

    expect(screen.getByText('Infinite / Undefined')).toBeInTheDocument()
    expect(screen.getByText(/xi >= 1/)).toBeInTheDocument()
    expect(screen.getByText('Infinite')).toBeInTheDocument()
  })

  it('shows a finite currency amount when the pure premium is computable', () => {
    vi.spyOn(hooks, 'usePurePremium').mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        pure_premium: 1_000_000,
        is_infinite: false,
        reason: null,
        expected_frequency: 104.58,
        expected_severity: 9_564.7,
      },
    })
    vi.spyOn(hooks, 'useSeverityFit').mockReturnValue({ isLoading: false, data: undefined })

    render(<Results theme="dark" />)

    expect(screen.getByText('$1,000,000')).toBeInTheDocument()
  })
})
