import createPlotlyComponent from 'react-plotly.js/factory'
import Plotly from 'plotly.js-dist-min'

const Plot = createPlotlyComponent(Plotly)

const DARK_LAYOUT = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#e2e8f0' },
  xaxis: { gridcolor: '#334155', zerolinecolor: '#475569' },
  yaxis: { gridcolor: '#334155', zerolinecolor: '#475569' },
  margin: { t: 40, r: 20, b: 48, l: 56 },
}

const LIGHT_LAYOUT = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#0f172a' },
  xaxis: { gridcolor: '#e2e8f0', zerolinecolor: '#cbd5e1' },
  yaxis: { gridcolor: '#e2e8f0', zerolinecolor: '#cbd5e1' },
  margin: { t: 40, r: 20, b: 48, l: 56 },
}

/** Plotly chart pre-themed for light/dark mode, sized to its container. */
export function PlotlyChart({ data, layout = {}, theme = 'dark', className = '', ...rest }) {
  const base = theme === 'dark' ? DARK_LAYOUT : LIGHT_LAYOUT

  return (
    <Plot
      data={data}
      layout={{
        ...base,
        ...layout,
        xaxis: { ...base.xaxis, ...layout.xaxis },
        yaxis: { ...base.yaxis, ...layout.yaxis },
        legend: { font: { color: base.font.color }, ...layout.legend },
        autosize: true,
      }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
      config={{ displayModeBar: false, responsive: true }}
      className={className}
      {...rest}
    />
  )
}
