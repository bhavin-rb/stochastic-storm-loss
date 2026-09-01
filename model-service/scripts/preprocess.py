"""Loads the thesis author's curated workbook and produces the cleaned CSVs used by
the frequency, severity, and pricing models (see PLAN.md Phase 1 for the verified
methodology this reproduces).
"""

from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parents[2]
CATASTROPHE_PERILS_XLSX = REPO_ROOT / "Catastrophe Perils Data.xlsx"
OUTPUT_DIR = REPO_ROOT / "data" / "processed"

INSURED_DAMAGE_COLUMN = "Insured Damage "  # trailing space in the source workbook
DEFAULT_THRESHOLD_PERCENTILE = 0.95


def load_annual_frequency(xlsx_path: Path = CATASTROPHE_PERILS_XLSX) -> pd.DataFrame:
    """Annual storm event counts, 2000-2023 (already aggregated in the source workbook)."""
    return pd.read_excel(xlsx_path, sheet_name="Storms")


def load_severity(xlsx_path: Path = CATASTROPHE_PERILS_XLSX) -> pd.Series:
    """Insured losses for storm events, kept in the source workbook's raw units."""
    sheet1 = pd.read_excel(xlsx_path, sheet_name="Sheet1")
    storms = sheet1[sheet1["Disaster Type"] == "Storm"]
    return storms[INSURED_DAMAGE_COLUMN].dropna().rename("Insured Loss")


def compute_exceedances(severity: pd.Series, threshold: float) -> pd.Series:
    """Peaks-over-threshold exceedances (severity - threshold) for values above threshold."""
    return (severity[severity > threshold] - threshold).rename("Excess Loss")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    annual_frequency = load_annual_frequency()
    annual_frequency.to_csv(OUTPUT_DIR / "annual_frequency.csv", index=False)

    severity = load_severity()
    severity.to_csv(OUTPUT_DIR / "severity.csv", index=False)

    threshold = severity.quantile(DEFAULT_THRESHOLD_PERCENTILE)
    exceedances = compute_exceedances(severity, threshold)
    exceedances.to_csv(OUTPUT_DIR / "severity_excesses.csv", index=False)

    print(f"Annual frequency: {len(annual_frequency)} years, "
          f"{annual_frequency['Event Frequency'].sum()} total events")
    print(f"Severity: {len(severity)} storm events with insured loss data")
    print(f"Threshold (95th percentile): {threshold:.0f}, {len(exceedances)} exceedances")


if __name__ == "__main__":
    main()
