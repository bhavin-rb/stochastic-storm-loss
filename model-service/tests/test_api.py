import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_frequency_fit_negbin_matches_thesis():
    response = client.get("/frequency/fit", params={"model": "negbin"})
    assert response.status_code == 200
    body = response.json()
    assert body["p"] == pytest.approx(0.34, abs=0.01)
    assert body["r"] == pytest.approx(53.11, abs=0.1)
    assert body["chi_square_statistic"] == pytest.approx(74.6, abs=0.5)
    assert body["p_value"] == pytest.approx(0.15, abs=0.02)


def test_frequency_fit_poisson_matches_thesis():
    response = client.get("/frequency/fit", params={"model": "poisson"})
    assert response.status_code == 200
    body = response.json()
    assert body["lambda"] == pytest.approx(104.58, abs=0.01)
    assert body["dispersion_index"] == pytest.approx(2.97, abs=0.01)
    assert body["chi_square_statistic"] == pytest.approx(428.68, abs=1)


def test_frequency_fit_rejects_invalid_model():
    response = client.get("/frequency/fit", params={"model": "bogus"})
    assert response.status_code == 422


def test_severity_fit_matches_thesis_at_default_threshold():
    response = client.get("/severity/fit", params={"threshold": 5_000_000})
    assert response.status_code == 200
    body = response.json()
    assert body["n_exceedances"] == 19
    assert body["shape"] == pytest.approx(1.1018, abs=0.001)
    assert body["scale"] == pytest.approx(8_162_979.71, rel=1e-4)
    assert body["is_infinite"] is True
    assert body["expected_severity"] is None


def test_severity_fit_rejects_out_of_range_threshold():
    assert client.get("/severity/fit", params={"threshold": 1}).status_code == 422
    assert client.get("/severity/fit", params={"threshold": 1_000_000_000}).status_code == 422


def test_pure_premium_is_infinite_at_default_threshold():
    response = client.get("/pricing/pure-premium", params={"threshold": 5_000_000, "model": "negbin"})
    assert response.status_code == 200
    body = response.json()
    assert body["is_infinite"] is True
    assert body["pure_premium"] is None
    assert body["expected_frequency"] == pytest.approx(104.58, abs=0.01)


def test_data_summary():
    response = client.get("/data/summary")
    assert response.status_code == 200
    body = response.json()
    assert len(body["annual_frequency"]["years"]) == 24
    assert len(body["severity"]) == 386
    assert "mean_residual_life" in body
