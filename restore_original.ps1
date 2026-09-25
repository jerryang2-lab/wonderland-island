$ErrorActionPreference = "Stop"

$backupSource = Join-Path $PSScriptRoot "_backups\backup_original_20260925_pre_words"

if (-not (Test-Path $backupSource)) {
    Write-Error "Backup directory not found: $backupSource"
    exit 1
}

Write-Host "======================================================" -ForegroundColor Yellow
Write-Host "Restoring website to original pre-modification state..." -ForegroundColor Yellow
Write-Host "Source: $backupSource" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Yellow

$confirm = Read-Host "Proceed with restoring original files? (Y/N)"
if ($confirm -eq "Y" -or $confirm -eq "y") {
    $items = Get-ChildItem -Path $backupSource
    foreach ($item in $items) {
        $dest = Join-Path $PSScriptRoot $item.Name
        Copy-Item -Path $item.FullName -Destination $dest -Recurse -Force
        Write-Host "  Restored: $($item.Name)" -ForegroundColor Green
    }
    Write-Host "Website successfully restored to original version!" -ForegroundColor Cyan
} else {
    Write-Host "Restore cancelled." -ForegroundColor Gray
}