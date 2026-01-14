@echo off
REM Quick Setup Script for HND Question Bank
REM This script automates the initial setup process

setlocal enabledelayedexpansion

echo ========================================
echo HND Question Bank - Quick Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Check if npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found in PATH
    pause
    exit /b 1
)

echo [OK] npm found:
npm --version
echo.

REM Get the workspace directory
set WORKSPACE_DIR=%CD%

echo [INFO] Workspace directory: %WORKSPACE_DIR%
echo.

REM Install server dependencies
echo ========================================
echo Installing Server Dependencies...
echo ========================================
cd "%WORKSPACE_DIR%\server"
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install server dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] Server dependencies already installed
)
echo.

REM Install client dependencies
echo ========================================
echo Installing Client Dependencies...
echo ========================================
cd "%WORKSPACE_DIR%\client"
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install client dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] Client dependencies already installed
)
echo.

REM Check if MySQL is running
echo ========================================
echo Checking MySQL Connection...
echo ========================================
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] MySQL is not in PATH
    echo Please make sure MySQL is running on localhost:3306
    echo.
) else (
    echo [OK] MySQL found in PATH
)
echo.

REM Run migrations
echo ========================================
echo Running Database Migrations...
echo ========================================
cd "%WORKSPACE_DIR%\server"
call npm run migrate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to run migrations
    echo Make sure MySQL is running and .env is configured correctly
    pause
    exit /b 1
)
echo.

REM Seed database
echo ========================================
echo Seeding Database...
echo ========================================
call npm run seed
if %errorlevel% neq 0 (
    echo [WARNING] Failed to seed database (this is okay if tables already exist)
)
echo.

REM Success message
echo ========================================
echo Setup Complete! ✓
echo ========================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd "%WORKSPACE_DIR%\server"
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd "%WORKSPACE_DIR%\client"
echo   npm run dev
echo.
echo Then visit: http://localhost:5173
echo.
pause
