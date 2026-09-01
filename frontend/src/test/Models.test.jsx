import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Models } from '../sections/Models'
import * as hooks from '../api/hooks'

vi.mock('../components/LazyPlotlyChart', () => ({
  LazyPlotlyChart: () => <div data-testid="plotly-chart" />,
}))

const frequencyData = {
  model: 'negbin',
  mean: 104.58,
  variance: 310.51,
  chi_square_statistic: 74.6,
  p_value: 0.15,
  event_range: [80, 90, 100],
  observed_frequency: [2, 5, 6],
  expected_frequency: [2.1, 4.8, 6.2],
}

const severityData = {
  n_exceedances: 19,
  shape: 1.1018,
  scale: 8_162_979.71,
  is_infinite: true,
  expected_severity: null,
  exceedances: [100_000, 200_000, 300_000],
  pdf_x: [0, 1, 2],
  pdf_y: [0.1, 0.2, 0.1],
}

const summaryData = {
  annual_frequency: { years: [2000, 2001], counts: [90, 100] },
  severity: [100_000, 200_000, 5_000_000],
  mean_residual_life: { thresholds: [100_000, 200_000], mean_excess: [500_000, 600_000] },
}

describe('Models section', () => {
  it('renders frequency and severity stats from the API and switches models', () => {
    vi.spyOn(hooks, 'useFrequencyFit').mockReturnValue({ isLoading: false, isError: false, data: frequencyData })
    vi.spyOn(hooks, 'useSeverityFit').mockReturnValue({ isLoading: false, isError: false, data: severityData })
    vi.spyOn(hooks, 'useDataSummary').mockReturnValue({ isLoading: false, isError: false, data: summaryData })

    render(<Models theme="dark" />)

    expect(screen.getByText('104.58')).toBeInTheDocument()
    expect(screen.getByText('19')).toBeInTheDocument()
    expect(screen.getByText('Infinite')).toBeInTheDocument()

    const poissonButton = screen.getByRole('button', { name: 'Poisson' })
    fireEvent.click(poissonButton)
    expect(poissonButton).toHaveAttribute('aria-pressed', 'true')
  })
})
