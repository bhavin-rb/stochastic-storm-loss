# PLAN.md — Catastrophic Storm Loss Web App

Source of truth: `AGENTS.md` (product/architecture requirements), `Final_thesis_submission .pdf` (methodology, all numbers below were reproduced and verified against it), `public_emdat.xlsx` (raw EM-DAT export, sheet `EM-DAT Data`, 15,527 rows x 46 columns), `Catastrophe Perils Data.xlsx` (the thesis author's own curated workbook, now available in the repo — this is the exact file referenced in the thesis appendix code and is the authoritative source for Phase 1).

## Verified facts (reproduced from the thesis + dataset, not assumptions)
- **Filter**: `Disaster Type == "Storm"`, `Start Year` between 2000-2023, global (no country filter) → **2510 events**, matching the thesis exactly. Subtypes present: Tropical cyclone (1286), Storm (General) (308), Severe weather (191), Blizzard/Winter storm (178), Lightning/Thunderstorms (169), Tornado (161), Extra-tropical storm (138), Hail (49), Sand/Dust storm (16), Storm surge (8), Derecho (6) — thesis includes all storm subtypes, not just tropical cyclones.
- **Frequency model**: annual event counts, 24 data points (one per year). Mean λ = 104.58, variance = 310.51, dispersion index = 2.97 (overdispersed → Poisson rejected: χ²=428.68, p≈0). Negative Binomial fit via method of moments: `p = mean/variance = 0.34`, `r = mean²/(variance-mean) = 53.11` (χ²=74.6, p=0.15 → good fit, NB is the thesis's chosen frequency model).
- **Severity variable**: `Insured Damage ('000 US$)` column only (thesis explicitly excludes Total Damage/economic losses — insured losses only, since that's what insurers are on the hook for). Raw column values are used directly as the loss amount (i.e. the thesis does **not** multiply by 1000 to convert '000 US$ to US$ — reproducing its numbers requires using the column as-is). N = 386 storm events with non-null insured damage (2000-2023, global).
- **GPD threshold**: 95th percentile of insured losses = **5,000,000** (in the raw column's units) → 19 exceedances. Diagnosed via Mean Residual Life plot (linear beyond this point) and Q-Q plot (good fit in low/mid quantiles, drifts at extreme tail — expected).
- **GPD fit**: `scipy.stats.genpareto.fit(exceedances)` with **location free** (not fixed at 0) → shape ξ = **1.1018**, scale σ = **8,162,979.71**. Since ξ ≥ 1, expected severity is **infinite** (`E[Y] = σ/(1-ξ)` undefined) — the thesis's own conclusion is that the pure premium **cannot be computed** with this data at this threshold, and it recommends CTE/VaR as future work instead of a finite mean.
- **Pure Premium formula** (thesis eq. 1): `Pure Premium = Expected Frequency × Expected Severity` — only computable when ξ < 1; must be clearly presented as undefined/infinite when ξ ≥ 1, exactly like the thesis's real finding (this is a genuine result, not a bug to "fix").
- `Catastrophe Perils Data.xlsx` is now available in the repo (the exact file the thesis appendix code loads) and was verified to reproduce every statistic above precisely: sheet `Storms` (24 rows, `Year`/`Event Frequency`) sums to 2510 events with mean 104.58 and variance 310.51; sheet `Sheet1` (15,527 rows, one row per EM-DAT event across all disaster types) filtered to `Disaster Type == "Storm"` and non-null `Insured Damage ` gives the same 386 rows and 95th-percentile threshold of 5,000,000. This workbook (not `public_emdat.xlsx`) is the authoritative, pre-aggregated source for Phase 1 — `public_emdat.xlsx` remains useful as a supplementary event-level detail source (subtype, country, location) for optional richer descriptive charts, since `Catastrophe Perils Data.xlsx`'s `Sheet1` only carries year/type/damage columns.
- Chapter structure to mirror in the Methodology/Results copy: 1 Introduction (Background, Key Terms, Current State of Knowledge, Aim), 2 Methodology (Data Source, Data Collection/Selection Criteria, Variables), 3 Data Analysis (3.1 Frequency: EDA, Poisson, Negative Binomial; 3.2 Severity: EDA, GPD fit, MRL plot, Q-Q plot, Expected Severity), 4 Final Conclusion, 5 Appendix (Python code).

## TL;DR
Monorepo: React/Vite frontend, Express backend (thin proxy/BFF), FastAPI model service (Python: Poisson/NegBin frequency, GPD/EVT severity, pure premium). One-time preprocessing script reads the pre-aggregated `Catastrophe Perils Data.xlsx` (frequency from `Storms` sheet, severity from `Sheet1` filtered to storms), optionally enriched with event-level detail from `public_emdat.xlsx`. Deploy frontend to Vercel, backend + model service to Render.

---

## Phase 0: Planning & Setup
1. Scaffold monorepo: `frontend/` (React + Vite), `backend/` (Node/Express), `model-service/` (Python/FastAPI), `data/processed/` (generated CSVs, gitignored if large).
2. Initialize each app independently (own `package.json`/`requirements.txt` — no Turborepo/monorepo tooling needed for MVP).
3. Add root `README.md` (setup/run instructions for all three apps) and `.gitignore` (node_modules, venv, `.env`, `data/processed`).

## Phase 1: Data Integration (Python) — reproduces the verified facts above
1. `model-service/scripts/preprocess.py`: load `Catastrophe Perils Data.xlsx` with pandas — read the `Storms` sheet directly for annual frequency (`Year`, `Event Frequency`, already 24 rows, no aggregation needed) and the `Sheet1` sheet filtered to `Disaster Type == "Storm"` for severity.
2. Frequency table: use the `Storms` sheet as-is (`Year`, `Event Frequency`).
3. Severity: from `Sheet1`, filter `Disaster Type == "Storm"`, drop nulls in `Insured Damage ` (note trailing space in the source column name), keep values as-is (no unit conversion, matching thesis) → 386-row table.
4. Compute threshold (95th percentile, ≈5,000,000) and exceedances (`severity - threshold` for values above it) → 19-row table; keep threshold configurable (function parameter) since the UI will let users move it.
5. Optionally enrich with `public_emdat.xlsx` (`EM-DAT Data` sheet, filtered the same way) for event-level detail (subtype, country, location) not present in `Catastrophe Perils Data.xlsx`, for any richer descriptive charts (e.g. subtype breakdown map) — not required for the core frequency/severity/pricing models.
6. Output `data/processed/annual_frequency.csv` (from `Storms` sheet), `severity.csv` (all non-null insured losses, for descriptive charts), `severity_excesses.csv` (at default threshold), and optionally `storm_events_detail.csv` if the `public_emdat.xlsx` enrichment step is used.
7. `pytest` smoke test: total events == 2510, year range correct, λ ≈ 104.58, non-null severity count == 386, exceedance count ≈ 19 at the default threshold.

## Phase 2: Model Implementation (FastAPI, Python) — *depends on Phase 1*
1. Scaffold `model-service/app/main.py`; `requirements.txt` (fastapi, uvicorn, pandas, scipy, statsmodels, pydantic).
2. `app/frequency.py`: Poisson fit (`λ = mean`), Negative Binomial fit via method of moments (`p = mean/var`, `r = mean²/(var-mean)`); Chi-squared goodness-of-fit for both (reproduce thesis's χ² approach: normalize/rescale expected frequencies to match observed totals, drop empty bins); return λ, p, r, dispersion index, chi², p-value for each model.
3. `app/severity.py`: GPD fit via `scipy.stats.genpareto.fit(exceedances)` (free location, matching thesis) for a caller-supplied threshold; return shape (ξ), scale (σ), location, exceedance count, and generated PDF/tail curve points + Q-Q plot data for charting. Validate threshold input (Pydantic, sane bounds e.g. 100k–50M) to keep exceedance count statistically meaningful and avoid degenerate fits with too few points.
4. `app/pricing.py`: Pure Premium = Expected Frequency (from chosen frequency model) × Expected Severity; if ξ ≥ 1, return an explicit "infinite/undefined" result (not an error) with the reason, mirroring the thesis's actual conclusion.
5. Endpoints: `GET /frequency/fit?model=poisson|negbin`, `GET /severity/fit?threshold=...`, `GET /pricing/pure-premium?threshold=...&model=...`, `GET /data/summary` (annual counts + severity distribution for descriptive charts).
6. `pytest` + FastAPI `TestClient` tests: endpoints return 200; invalid threshold/model rejected; at the default $5,000,000 threshold, fitted ξ ≈ 1.10 and σ ≈ 8,162,980 (regression test against the verified thesis numbers).

## Phase 3: Backend API (Express) — *parallel with Phase 2, integration depends on it*
1. Scaffold `backend/src/index.js`, `backend/src/routes/api.js`.
2. Proxy routes to `model-service` (env var `MODEL_SERVICE_URL`): `/api/frequency`, `/api/severity`, `/api/pricing`, `/api/data/summary`.
3. Validate/sanitize client input (zod or joi) before forwarding — threshold range, model enum — per OWASP input-validation guidance.
4. CORS restricted to the deployed frontend origin (env-driven, not wildcard); `express-rate-limit` on the model-fit routes.
5. Error-handling middleware: model-service timeout/down → clean 502 JSON, no stack traces leaked.
6. `supertest` smoke tests against a mocked model-service.

## Phase 4: Frontend (React + Vite) — *scaffold in parallel with Phases 2-3, wiring depends on them*
1. Vite + React app in `frontend/`; Tailwind CSS (dark mode via `class` strategy, dark as default), Framer Motion (parallax/fade-in), `react-plotly.js` + `plotly.js` (handles bar/line/Q-Q/mean-residual-life plots in one library), TanStack Query for API fetching/caching.
2. Single scrollable page, anchor-navigated (no react-router — matches AGENTS.md's SPA + "menu tabs" wording): Home (hero + parallax), Methodology (Poisson/NB/GPD explanations mirroring thesis sections 2-3, formulas via `react-katex`), Models (interactive frequency/severity explorer: model selector, threshold slider), Results (pure premium output — including the "infinite/undefined" case — plus comparison charts), About (university name, LinkedIn link, project context). Reuse existing `images/` assets per section.
3. Dark/light theme toggle (persisted via localStorage), responsive layout (mobile + desktop).
4. `Vitest` + React Testing Library: theme toggle, key components render, chart components display mocked API data correctly (including the infinite-severity edge case).

## Phase 5: Visualization & Interactivity polish — *depends on Phase 4 wiring*
1. Wire GPD threshold slider (e.g. $1M-$20M range) and frequency model selector to live-refetch `/api/severity` and `/api/pricing`, debounced.
2. Descriptive charts from `/api/data/summary`: annual frequency time series, severity histogram/tail, GPD fit overlay, Q-Q plot, Mean Residual Life plot (reproducing thesis Figures 1-6 interactively).
3. Micro-animations (hover states, transitions between sections).
4. CSV/PDF export: optional/stretch, explicitly deferred past MVP per AGENTS.md.

## Phase 6: Deployment
1. Frontend → Vercel (or Netlify), env var pointing at backend URL.
2. Backend + model-service → two separate Render web services; Express `MODEL_SERVICE_URL` points at the FastAPI service's URL.
3. Production CORS origin on Express locked to the deployed frontend URL.
4. End-to-end smoke test: all sections load, sliders update charts, dark/light toggle persists, no console errors.

---

## Relevant files (repo currently only has AGENTS.md, images/, PDF, both xlsx files — all below are new)
- `README.md` — setup/run instructions for all three apps.
- `model-service/scripts/preprocess.py` — loads `Catastrophe Perils Data.xlsx` (`Storms` + `Sheet1`), optional `public_emdat.xlsx` enrichment (Phase 1).
- `model-service/app/{main,frequency,severity,pricing}.py` — FastAPI endpoints (Phase 2).
- `backend/src/index.js`, `backend/src/routes/api.js` — Express proxy/BFF (Phase 3).
- `frontend/src/sections/{Home,Methodology,Models,Results,About}.jsx` — SPA sections (Phase 4).
- `images/*.jpg` — existing hero/about/methodology/data-analysis/conclusion images, reused per section.

## Verification
1. Phase 1: `pytest` — event count (2510), year range, λ≈104.58, severity N=386, exceedance count at default threshold.
2. Phase 2: `pytest`/`TestClient` — endpoint 200s, invalid-input rejection, regression-test fitted GPD params (ξ≈1.10, σ≈8,162,980) and NB params (p≈0.34, r≈53.11) against the verified thesis numbers.
3. Phase 3: `supertest` smoke tests; manual check of rate limiting/CORS rejection.
4. Phase 4/5: `vitest` component tests; manual browser check (desktop + mobile) of all 5 sections, theme toggle, slider interactivity, and the infinite-severity display case.
5. Phase 6: manual smoke test of deployed URLs, no CORS/console errors.

## Decisions
- Storm scope: `Disaster Type == "Storm"`, all 11 subtypes, global, 2000-2023 (verified exact match to thesis's 2510 events).
- Severity metric: `Insured Damage ('000 US$)` column used as-is, no unit conversion (verified — this reproduces the thesis's exact threshold/GPD numbers).
- Frequency model: annual global event counts, no regional/covariate disaggregation (verified — matches thesis's actual approach, not an assumption).
- GPD fit: free location parameter via `scipy.stats.genpareto.fit()` (verified — fixing location at 0 gives different, non-matching parameters).
- Pure Premium: displayed as infinite/undefined when ξ ≥ 1, exactly reproducing the thesis's real conclusion rather than forcing a finite number.
- Python/Node integration: separate FastAPI microservice called by Express (user-confirmed).
- Charting library: Plotly.js (single library, covers both simple charts and EVT diagnostic plots).
- File upload of custom datasets: excluded from MVP — "upload and interact" interpreted as interacting with the shipped, preprocessed dataset.
- No React Router: single scrollable page with anchor-based nav.
- Security: input validation both sides (Pydantic + zod/joi), restricted CORS, rate limiting on compute-heavy endpoints, no secrets committed, no arbitrary file-upload attack surface in MVP.

## Further Considerations
1. `Catastrophe Perils Data.xlsx` also contains `Earthquakes`, `Floods`, `Wildfires` sheets (same pre-aggregated `Year`/`Event Frequency` shape as `Storms`) — out of scope per AGENTS.md's storm-only focus, but noted in case a future comparison view across perils is ever requested.
2. CSV/PDF export marked optional/stretch in AGENTS.md — recommend excluding from MVP and revisiting after core phases are verified.
3. Because expected severity is genuinely infinite at the thesis's default threshold, consider (as a stretch, matching the thesis's own "future work" note) exposing a simple Conditional Tail Expectation or Value-at-Risk metric in the Results section as an alternative to the pure premium when ξ ≥ 1 — not required for MVP but flagged since the thesis explicitly recommends it.
