param (
    [Parameter(Mandatory=$false)]
    [string]$Message = "Routine web update"
)

$ErrorActionPreference = "Stop"

Set-Location -Path $PSScriptRoot

$now = Get-Date
$timestamp = $now.ToString("yyyy-MM-dd HH:mm:ss")
$tagStamp = $now.ToString("yyyyMMdd-HHmmss")
$tagName = "release-$tagStamp"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Deploying website to GitHub..." -ForegroundColor Cyan
Write-Host "Timestamp: $timestamp" -ForegroundColor Yellow
Write-Host "Tag: $tagName" -ForegroundColor Yellow
Write-Host "Message: $Message" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Update DEPLOY_LOG.md
$logFile = Join-Path $PSScriptRoot "DEPLOY_LOG.md"
if (-not (Test-Path $logFile)) {
    $header = "# Wonderland Island - Deployment Log`n`n| Timestamp | Tag | Operator | Message |`n| :--- | :--- | :--- | :--- |"
    [System.IO.File]::WriteAllText($logFile, $header, [System.Text.Encoding]::UTF8)
}
$logEntry = "`n| $timestamp | $tagName | $env:USERNAME | $Message |"
[System.IO.File]::AppendAllText($logFile, $logEntry, [System.Text.Encoding]::UTF8)

# 2. Stage and commit
Write-Host "[1/3] Staging files and committing..." -ForegroundColor Cyan
git add .
$commitStatus = git status --porcelain
if (-not $commitStatus) {
    Write-Host "No changes detected, skipping commit." -ForegroundColor Yellow
} else {
    git commit -m "deploy: $Message [$timestamp]"
}

# 3. Create annotated Git tag
Write-Host "[2/3] Creating version tag: $tagName..." -ForegroundColor Cyan
git tag -a $tagName -m "Deploy at $timestamp - $Message"

# 4. Push to GitHub
$hasRemote = git remote
if (-not $hasRemote) {
    Write-Host "Notice: No GitHub remote (origin) configured yet." -ForegroundColor Yellow
    Write-Host "To link GitHub repository, run:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/<username>/<repo>.git" -ForegroundColor Cyan
    Write-Host "  git push -u origin main --tags" -ForegroundColor Cyan
} else {
    Write-Host "[3/3] Pushing to GitHub (origin main)..." -ForegroundColor Cyan
    git push origin main --tags
    Write-Host "Deployment completed!" -ForegroundColor Green
}
Write-Host "======================================================" -ForegroundColor Cyan