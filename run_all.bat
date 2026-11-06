@echo off
title PROSTUTI (প্রস্তুতি) Launcher
echo ===============================================================
echo   PROSTUTI (প্রস্তুতি) - Prepare. Practice. Prevail.
echo   Starting Backend and Frontend...
echo ===============================================================

start "Prostuti Backend (FastAPI)" cmd /k "cd backend && python run.py"
timeout /t 2 /nobreak >nul
start "Prostuti Frontend (Next.js)" cmd /k "cd frontend && npm run start"

echo.
echo Both servers launched in separate windows!
echo - Web App:      http://localhost:3000
echo - API Docs:     http://127.0.0.1:8000/docs
echo.
pause
