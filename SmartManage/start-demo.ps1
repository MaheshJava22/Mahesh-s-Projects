$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$frontendPath = Join-Path $projectRoot 'frontend'

if (-not (Test-Path (Join-Path $projectRoot 'mvnw.cmd'))) {
    throw 'Could not find mvnw.cmd. Run this script from the SmartManage project folder.'
}
if (-not (Test-Path (Join-Path $frontendPath 'package.json'))) {
    throw 'Could not find frontend/package.json. Make sure you are using the project copy that contains the frontend folder.'
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw 'npm was not found. Install Node.js, then open a new PowerShell window.'
}
if (-not (Test-Path (Join-Path $frontendPath 'node_modules'))) {
    throw 'Frontend packages are not installed yet. Run "npm install" from the frontend folder, then start the demo again.'
}

function Test-LocalEndpoint {
    param(
        [Parameter(Mandatory = $true)][string]$Uri,
        [string]$ExpectedText
    )

    try {
        $response = Invoke-WebRequest -Uri $Uri -TimeoutSec 2
        if ($ExpectedText) {
            return $response.Content.Contains($ExpectedText)
        }
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    } catch {
        if ($_.Exception.Response -and [int]$_.Exception.Response.StatusCode -eq 401) {
            return $true
        }
        return $false
    }
}

$backendRunning = Test-LocalEndpoint -Uri 'http://localhost:8426/getcust'
if (-not $backendRunning) {
    $backendArgs = @('-NoExit', '-Command', "& '.\mvnw.cmd' spring-boot:run")
    Start-Process -FilePath 'powershell.exe' -WorkingDirectory $projectRoot -ArgumentList $backendArgs
}

$frontendRunning = Test-LocalEndpoint -Uri 'http://localhost:5173/' -ExpectedText 'SmartManage'
if (-not $frontendRunning) {
    $frontendArgs = @('-NoExit', '-Command', 'npm run dev -- --strictPort')
    Start-Process -FilePath 'powershell.exe' -WorkingDirectory $frontendPath -ArgumentList $frontendArgs
}

for ($attempt = 0; $attempt -lt 60; $attempt++) {
    $backendReady = Test-LocalEndpoint -Uri 'http://localhost:8426/getcust'
    $frontendReady = Test-LocalEndpoint -Uri 'http://localhost:5173/' -ExpectedText 'SmartManage'
    if ($backendReady -and $frontendReady) { break }
    Start-Sleep -Seconds 1
}
Start-Process 'http://localhost:5173/'

Write-Host 'SmartManage demo is opening. Keep any started PowerShell windows open.'
if ($backendRunning) { Write-Host 'Reusing the Spring Boot API already running on port 8426.' }
if ($frontendRunning) { Write-Host 'Reusing the SmartManage frontend already running on port 5173.' }
Write-Host 'Frontend: http://localhost:5173'
Write-Host 'Backend:  http://localhost:8426'
