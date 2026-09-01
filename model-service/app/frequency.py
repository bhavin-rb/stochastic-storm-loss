"""Poisson and Negative Binomial fits for annual storm frequency, reproducing the
thesis's appendix methodology (method-of-moments NB, chi-squared goodness-of-fit).
"""

import numpy as np
import pandas as pd
from scipy.stats import chisquare, nbinom, poisson


def fit_poisson(counts: pd.Series) -> dict:
    total_years = len(counts)
    lam = float(counts.mean())
    variance = float(counts.var(ddof=1))
    dispersion_index = variance / lam

    max_event = int(counts.max())
    event_range = np.arange(0, max_event + 1)
    observed_freq, _ = np.histogram(counts, bins=range(0, max_event + 2))
    expected_freq = poisson.pmf(event_range, lam) * total_years
    # rescale so expected totals match observed totals (rounding-error correction, per thesis)
    expected_freq = expected_freq * (observed_freq.sum() / expected_freq.sum())

    chi_square_statistic, p_value = chisquare(f_obs=observed_freq, f_exp=expected_freq)

    return {
        "model": "poisson",
        "lambda": lam,
        "mean": lam,
        "variance": variance,
        "dispersion_index": dispersion_index,
        "chi_square_statistic": float(chi_square_statistic),
        "p_value": float(p_value),
        "event_range": event_range.tolist(),
        "observed_frequency": observed_freq.tolist(),
        "expected_frequency": expected_freq.tolist(),
    }


def fit_negative_binomial(counts: pd.Series) -> dict:
    mean = float(counts.mean())
    variance = float(counts.var(ddof=1))
    p = mean / variance
    r = mean**2 / (variance - mean)

    min_freq, max_freq = int(counts.min()), int(counts.max())
    bins = np.arange(min_freq, max_freq + 1)
    observed_freq = np.array([np.sum(counts == i) for i in bins])
    expected_freq = nbinom.pmf(bins, r, p) * len(counts)

    # drop bins with no observed or expected mass to avoid division by zero, per thesis
    mask = (observed_freq + expected_freq) > 0
    bins, observed_freq, expected_freq = bins[mask], observed_freq[mask], expected_freq[mask]
    expected_freq = expected_freq * (observed_freq.sum() / expected_freq.sum())

    chi_square_statistic, p_value = chisquare(f_obs=observed_freq, f_exp=expected_freq)

    return {
        "model": "negbin",
        "p": p,
        "r": r,
        "mean": mean,
        "variance": variance,
        "chi_square_statistic": float(chi_square_statistic),
        "p_value": float(p_value),
        "event_range": bins.tolist(),
        "observed_frequency": observed_freq.tolist(),
        "expected_frequency": expected_freq.tolist(),
    }
