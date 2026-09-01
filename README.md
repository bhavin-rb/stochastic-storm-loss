# Stochastic Modelling of Catastrophic Storm Losses — Web App

Interactive web app based on the Bachelor Thesis *"Stochastic Modelling of Catastrophic Storm Losses:
Frequency-Severity Analysis for Insurance Pricing"*. See [PLAN.md](PLAN.md) for the full implementation
plan and [AGENTS.md](AGENTS.md) for project requirements.

## Structure
- `frontend/` — React + Vite single-page app.
- `backend/` — Node/Express API (proxies to `model-service`).
- `model-service/` — Python/FastAPI service for the Poisson/Negative Binomial frequency models,
  GPD/EVT severity model, and pure premium pricing.
- `data/processed/` — generated CSVs produced by `model-service/scripts/preprocess.py` (not committed).

## Setup

### model-service (Python)
```
cd model-service
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python scripts\preprocess.py
.venv\Scripts\python -m pytest
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

### backend (Node/Express)
```
cd backend
npm install
copy .env.example .env
npm run dev
```

### frontend (React/Vite)
```
cd frontend
npm install
npm run dev
```
