# Starts all three services for local development: model-service (FastAPI), backend (Express), frontend (Vite).
# Run from the repo root: powershell -ExecutionPolicy Bypass -File .\dev.ps1
# Press Ctrl+C in this window to stop all three.

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

$modelService = Start-Process -PassThru -WindowStyle Normal powershell -ArgumentList @(
    '-NoExit', '-Command',
    "cd '$root\model-service'; .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
)

$backend = Start-Process -PassThru -WindowStyle Normal powershell -ArgumentList @(
    '-NoExit', '-Command',
    "cd '$root\backend'; npm run dev"
)

$frontend = Start-Process -PassThru -WindowStyle Normal powershell -ArgumentList @(
    '-NoExit', '-Command',
    "cd '$root\frontend'; npm run dev"
)

Write-Host ""
Write-Host "Started:"
Write-Host "  model-service -> http://localhost:8000  (PID $($modelService.Id))"
Write-Host "  backend       -> http://localhost:4000  (PID $($backend.Id))"
Write-Host "  frontend      -> http://localhost:5173  (PID $($frontend.Id))"
Write-Host ""
Write-Host "Each service is running in its own window. Close those windows (or Ctrl+C in each) to stop them."
