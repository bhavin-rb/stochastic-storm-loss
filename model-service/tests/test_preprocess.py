import pytest

from scripts.preprocess import (
    DEFAULT_THRESHOLD_PERCENTILE,
    compute_exceedances,
    load_annual_frequency,
    load_severity,
)


def test_annual_frequency_matches_thesis():
    annual_frequency = load_annual_frequency()
    assert len(annual_frequency) == 24
    assert annual_frequency["Year"].min() == 2000
    assert annual_frequency["Year"].max() == 2023
    total_events = annual_frequency["Event Frequency"].sum()
    assert total_events == 2510
    assert annual_frequency["Event Frequency"].mean() == pytest.approx(104.58, abs=0.01)


def test_severity_matches_thesis():
    severity = load_severity()
    assert len(severity) == 386
    assert (severity > 0).all()


def test_exceedances_at_default_threshold_match_thesis():
    severity = load_severity()
    threshold = severity.quantile(DEFAULT_THRESHOLD_PERCENTILE)
    assert threshold == 5_000_000
    exceedances = compute_exceedances(severity, threshold)
    assert len(exceedances) == 19
    assert (exceedances > 0).all()

