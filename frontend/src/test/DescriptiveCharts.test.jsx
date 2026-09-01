import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DescriptiveCharts } from '../components/DescriptiveCharts'
import * as hooks from '../api/hooks'

vi.mock('../components/LazyPlotlyChart', () => ({
  LazyPlotlyChart: () => <div data-testid="plotly-chart" />,
}))

describe('DescriptiveCharts', () => {
  it('shows a loading state', () => {
    vi.spyOn(hooks, 'useDataSummary').mockReturnValue({ isLoading: true, isError: false, data: undefined })
    render(<DescriptiveCharts theme="dark" threshold={5_000_000} />)
    expect(screen.getByText(/loading dataset overview/i)).toBeInTheDocument()
  })

  it('renders the three descriptive charts once data loads', () => {
    vi.spyOn(hooks, 'useDataSummary').mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        annual_frequency: { years: [2000, 2001], counts: [90, 100] },
        severity: [100_000, 200_000, 5_000_000],
        mean_residual_life: { thresholds: [100_000, 200_000], mean_excess: [500_000, 600_000] },
      },
    })

    render(<DescriptiveCharts theme="dark" threshold={5_000_000} />)

    expect(screen.getByText('Annual storm frequency')).toBeInTheDocument()
    expect(screen.getByText('Severity distribution')).toBeInTheDocument()
    expect(screen.getByText('Mean Residual Life')).toBeInTheDocument()
    expect(screen.getAllByTestId('plotly-chart')).toHaveLength(3)
  })
})
