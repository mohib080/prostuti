Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "  PROSTUTI (প্রস্তুতি) - Prepare. Practice. Prevail." -ForegroundColor Yellow
Write-Host "  Launching Backend (FastAPI) and Frontend (Next.js)..." -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$scriptDir\backend`" && python run.py" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Frontend
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$scriptDir\frontend`" && npm run start" -WindowStyle Normal

Write-Host "`nBoth services are starting!" -ForegroundColor Green
Write-Host "Web Application: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "Health Check: http://127.0.0.1:8000/api/health" -ForegroundColor White
