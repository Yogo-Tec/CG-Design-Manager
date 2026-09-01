@echo off
setlocal EnableExtensions EnableDelayedExpansion
title CG Design Manager Launcher

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not available in PATH.
  echo Install Node.js 20 or newer, then run this file again.
  pause
  exit /b 1
)

set "CGDM_PORT=3000"
if exist ".env" (
  for /f "usebackq tokens=1,* delims==" %%A in (`findstr /b /c:"PORT=" ".env"`) do set "CGDM_PORT=%%B"
)

if not exist "node_modules\" (
  echo Installing application dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

set "CGDM_URL=http://localhost:!CGDM_PORT!/pages/dashboard.html"
echo Starting CG Design Manager at !CGDM_URL!
start "CG Design Manager Server" cmd /k "cd /d ""%~dp0"" && npm start"

echo Waiting for the local server...
for /l %%I in (1,1,20) do (
  powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 'http://localhost:!CGDM_PORT!/api/health'; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>nul
  if not errorlevel 1 goto :open_browser
  timeout /t 1 /nobreak >nul
)

echo The server did not become ready. Check the server window for details.
pause
exit /b 1

:open_browser
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "!CGDM_URL!"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "!CGDM_URL!"
) else if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
  start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" "!CGDM_URL!"
) else (
  echo Google Chrome was not found. Opening the default browser instead.
  start "" "!CGDM_URL!"
)

echo CG Design Manager is running. You may close this launcher window.
exit /b 0
