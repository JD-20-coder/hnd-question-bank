#!/usr/bin/env pwsh
# HND Question Bank - Quick Start Script

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "======================================"
Write-Host "  HND Question Bank - Quick Start"
Write-Host "======================================"
Write-Host ""

# Check MySQL
Write-Host "Checking MySQL connection..."
try {
    $mysql = mysql -u root -e "SELECT 1;" 2>$null
    Write-Host "[OK] MySQL is running"
} catch {
    Write-Host "[!] Warning: MySQL connection failed"
    Write-Host "[!] Make sure MySQL is running and .env credentials are correct"
    Write-Host ""
}

# Check Node.js
try {
    $node = node --version
    Write-Host "[OK] Node.js $node installed"
} catch {
    Write-Host "[X] Node.js not found. Please install Node.js 16+"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check and install dependencies
if (-not (Test-Path "$baseDir\node_modules")) {
    Write-Host "[!] Installing root dependencies..."
    Push-Location $baseDir
    npm install
    Pop-Location
}

if (-not (Test-Path "$baseDir\server\node_modules")) {
    Write-Host "[!] Installing server dependencies..."
    Push-Location "$baseDir\server"
    npm install
    Pop-Location
}

if (-not (Test-Path "$baseDir\client\node_modules")) {
    Write-Host "[!] Installing client dependencies..."
    Push-Location "$baseDir\client"
    npm install
    Pop-Location
}

# Setup database
Write-Host ""
Write-Host "[?] Setting up database..."
Push-Location "$baseDir\server"
npm run migrate
Pop-Location

# Start servers
Write-Host ""
Write-Host "======================================"
Write-Host "Starting development servers..."
Write-Host "======================================"
Write-Host ""
Write-Host "Server: http://localhost:4000"
Write-Host "Client: http://localhost:5173"
Write-Host ""
Write-Host "Press Ctrl+C to stop"
Write-Host ""

Push-Location $baseDir
npm run dev
