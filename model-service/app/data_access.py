"""Loads the preprocessed CSVs produced by scripts/preprocess.py."""

from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parents[2]
PROCESSED_DIR = REPO_ROOT / "data" / "processed"


def _require(path: Path) -> Path:
    if not path.exists():
        raise FileNotFoundError(
            f"{path} not found — run `python scripts/preprocess.py` from model-service/ first."
        )
    return path


def load_annual_counts() -> pd.Series:
    """Annual storm event counts indexed by year."""
    df = pd.read_csv(_require(PROCESSED_DIR / "annual_frequency.csv"))
    return df.set_index("Year")["Event Frequency"]


def load_severity() -> pd.Series:
    """All non-null insured losses for storm events, in the source workbook's raw units."""
    df = pd.read_csv(_require(PROCESSED_DIR / "severity.csv"))
    return df["Insured Loss"]
