"""GPD/EVT severity fit (Peaks Over Threshold), reproducing the thesis's methodology:
scipy.stats.genpareto.fit() with a free location parameter.
"""

import numpy as np
import pandas as pd
from scipy.stats import genpareto


def fit_gpd(severity: pd.Series, threshold: float) -> dict:
    exceedances = (severity[severity > threshold] - threshold).to_numpy()
    shape, loc, scale = genpareto.fit(exceedances)
    shape, loc, scale = float(shape), float(loc), float(scale)

    is_infinite = shape >= 1
    expected_severity = None if is_infinite else scale / (1 - shape)

    x = np.linspace(0, exceedances.max(), 100)
    fitted_pdf = genpareto.pdf(x, shape, loc, scale)

    n = len(exceedances)
    sorted_exceedances = np.sort(exceedances)
    plotting_positions = (np.arange(1, n + 1) - 0.5) / n
    theoretical_quantiles = genpareto.ppf(plotting_positions, shape, loc=loc, scale=scale)

    return {
        "threshold": threshold,
        "n_exceedances": n,
        "shape": shape,
        "loc": loc,
        "scale": scale,
        "is_infinite": is_infinite,
        "expected_severity": expected_severity,
        "pdf_x": x.tolist(),
        "pdf_y": fitted_pdf.tolist(),
        "exceedances": exceedances.tolist(),
        "qq_theoretical": theoretical_quantiles.tolist(),
        "qq_empirical": sorted_exceedances.tolist(),
    }


def compute_mean_residual_life(severity: pd.Series, n_thresholds: int = 50) -> dict:
    """Mean excess at a range of thresholds up to the 95th percentile (thesis Figure 4)."""
    max_threshold = severity.quantile(0.95)
    thresholds = np.linspace(severity.min(), max_threshold, n_thresholds)
    mean_excess = [
        float((severity[severity > t] - t).mean()) if (severity > t).any() else None
        for t in thresholds
    ]
    return {"thresholds": thresholds.tolist(), "mean_excess": mean_excess}
