@echo off
REM HND Question Bank - Quick Start Script
setlocal enabledelayedexpansion

set "basedir=%~dp0"
set "basedir=%basedir:~0,-1%"

echo.
echo ======================================
echo  HND Question Bank - Quick Start
echo ======================================
echo.

REM Check if MySQL is running
echo Checking MySQL connection...
mysql -u root -e "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo [!] Warning: MySQL connection failed
    echo [!] Make sure MySQL is running and .env credentials are correct
    echo.
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)

echo [OK] Node.js installed

REM Check dependencies
if not exist "%basedir%\node_modules" (
    echo [!] Installing root dependencies...
    call npm install
)

if not exist "%basedir%\server\node_modules" (
    echo [!] Installing server dependencies...
    cd /d "%basedir%\server"
    call npm install
)

if not exist "%basedir%\client\node_modules" (
    echo [!] Installing client dependencies...
    cd /d "%basedir%\client"
    call npm install
)

cd /d "%basedir%"

REM Setup database
echo.
echo [?] Setting up database...
cd /d "%basedir%\server"
call npm run migrate

REM Start servers
echo.
echo ======================================
echo Starting development servers...
echo ======================================
echo.
echo Server: http://localhost:4000
echo Client: http://localhost:5173
echo.
echo Press Ctrl+C to stop
echo.

cd /d "%basedir%"
call npm run dev

pause
