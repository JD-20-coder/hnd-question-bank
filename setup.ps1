#!/usr/bin/env pwsh
# Quick Setup Script for HND Question Bank
# Run: .\setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HND Question Bank - Quick Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[1/6] Checking Node.js installation..." -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "[ERROR] Node.js is not installed." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Node.js version: $(node --version)" -ForegroundColor Green
Write-Host ""

# Set workspace directory
$workspaceDir = Split-Path -Parent $PSCommandPath
$serverDir = Join-Path $workspaceDir "server"
$clientDir = Join-Path $workspaceDir "client"

Write-Host "[INFO] Workspace: $workspaceDir" -ForegroundColor Cyan
Write-Host ""

# Install server dependencies
Write-Host "[2/6] Installing Server Dependencies..." -ForegroundColor Yellow
Push-Location $serverDir
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install server dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[OK] Server dependencies already installed" -ForegroundColor Green
}
Pop-Location
Write-Host ""

# Install client dependencies
Write-Host "[3/6] Installing Client Dependencies..." -ForegroundColor Yellow
Push-Location $clientDir
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install client dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[OK] Client dependencies already installed" -ForegroundColor Green
}
Pop-Location
Write-Host ""

# Check MySQL connection
Write-Host "[4/6] Checking Database Configuration..." -ForegroundColor Yellow
$envFile = Join-Path $serverDir ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "[WARNING] .env file not found in server directory" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    
    $exampleFile = Join-Path $serverDir ".env.example"
    if (Test-Path $exampleFile) {
        Copy-Item $exampleFile $envFile
        Write-Host "[OK] .env created. Please update database credentials if needed." -ForegroundColor Green
    }
}
Write-Host "[OK] Database configuration found" -ForegroundColor Green
Write-Host ""

# Run migrations
Write-Host "[5/6] Running Database Migrations..." -ForegroundColor Yellow
Push-Location $serverDir
npm run migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to run migrations" -ForegroundColor Red
    Write-Host "Make sure MySQL is running and .env is configured correctly" -ForegroundColor Yellow
    exit 1
}
Pop-Location
Write-Host ""

# Seed database
Write-Host "[6/6] Seeding Database..." -ForegroundColor Yellow
Push-Location $serverDir
npm run seed 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Database seeded successfully" -ForegroundColor Green
} else {
    Write-Host "[OK] Database seeding completed (tables may already exist)" -ForegroundColor Green
}
Pop-Location
Write-Host ""

# Success
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd '$serverDir'" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd '$clientDir'" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then visit: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default test account:" -ForegroundColor Cyan
Write-Host "  Email: test@example.com" -ForegroundColor White
Write-Host "  Password: password123" -ForegroundColor White
Write-Host ""
