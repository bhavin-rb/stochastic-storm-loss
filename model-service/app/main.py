from typing import Literal

from fastapi import FastAPI, Query

from app.data_access import load_annual_counts, load_severity
from app.frequency import fit_negative_binomial, fit_poisson
from app.pricing import compute_pure_premium
from app.severity import compute_mean_residual_life, fit_gpd

app = FastAPI(title="Storm Loss Model Service")

DEFAULT_THRESHOLD = 5_000_000.0
MIN_THRESHOLD = 100_000.0
MAX_THRESHOLD = 50_000_000.0

FrequencyModel = Literal["poisson", "negbin"]


def _fit_frequency(model: FrequencyModel, counts) -> dict:
    return fit_poisson(counts) if model == "poisson" else fit_negative_binomial(counts)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/frequency/fit")
def frequency_fit(model: FrequencyModel = "negbin"):
    return _fit_frequency(model, load_annual_counts())


@app.get("/severity/fit")
def severity_fit(threshold: float = Query(DEFAULT_THRESHOLD, ge=MIN_THRESHOLD, le=MAX_THRESHOLD)):
    return fit_gpd(load_severity(), threshold)


@app.get("/pricing/pure-premium")
def pricing_pure_premium(
    threshold: float = Query(DEFAULT_THRESHOLD, ge=MIN_THRESHOLD, le=MAX_THRESHOLD),
    model: FrequencyModel = "negbin",
):
    frequency_result = _fit_frequency(model, load_annual_counts())
    severity_result = fit_gpd(load_severity(), threshold)
    return compute_pure_premium(frequency_result["mean"], severity_result)


@app.get("/data/summary")
def data_summary():
    counts = load_annual_counts()
    severity = load_severity()
    return {
        "annual_frequency": {"years": counts.index.tolist(), "counts": counts.tolist()},
        "severity": severity.tolist(),
        "mean_residual_life": compute_mean_residual_life(severity),
    }
