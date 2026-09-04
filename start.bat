@echo off
cd /d "%~dp0"
title Women Safety App - Launcher
cls
echo ===================================================
echo       Women Safety App - Launching System
echo ===================================================
echo.

:: 1. Auto-start MongoDB service if not already running
echo 1. Checking MongoDB service...
sc query MongoDB | findstr /i "RUNNING" >nul
if %errorlevel% neq 0 (
    echo    MongoDB is not running. Starting MongoDB service...
    net start MongoDB 2>nul
    if %errorlevel% neq 0 (
        echo    Requesting Administrator rights to start MongoDB...
        powershell -Command "Start-Process cmd -ArgumentList '/c net start MongoDB' -Verb RunAs -Wait"
    )
) else (
    echo    MongoDB service is active and running.
)

:: 2. Start Backend Server
echo.
echo 2. Starting Backend Server (Port 5001)...
cd server
start "Women Safety - Backend Server" cmd /k "npm start"

:: 3. Waiting for server to initialize
echo.
echo 3. Waiting for server to initialize...
ping 127.0.0.1 -n 5 >nul

:: 4. Start Frontend Client
echo.
echo 4. Starting Frontend Client (Port 3000)...
cd ..\client
start "Women Safety - Frontend Client" cmd /k "npm start"

echo.
echo ===================================================
echo   Services Started Successfully!
echo   - Backend Server: http://localhost:5001
echo   - Frontend Client: http://localhost:3000
echo ===================================================
echo.
echo Both services are running in separate windows.
echo You can close this launcher window at any time.
pause
