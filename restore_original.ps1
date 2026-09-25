# restore_original.ps1
# 銝?萄??券???????(2026-09-25 ?寧???憪???

$backupSource = Join-Path $PSScriptRoot "_backups\backup_original_20260925_pre_words"

if (-not (Test-Path $backupSource)) {
    Write-Error "?曆??啣?隞賜?? $backupSource"
    exit 1
}

Write-Host "======================================================" -ForegroundColor Yellow
Write-Host "?? ?喳?撠雯蝡??湧?? 2026-09-25 ???祉???.." -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Yellow

$confirm = Read-Host "蝣箏?閬銵???嚗?Y/N)"
if ($confirm -eq "Y" -or $confirm -eq "y") {
    $items = Get-ChildItem -Path $backupSource
    foreach ($item in $items) {
        $dest = Join-Path $PSScriptRoot $item.Name
        Copy-Item -Path $item.FullName -Destination $dest -Recurse -Force
        Write-Host "  撌脤??? $($item.Name)" -ForegroundColor Green
    }
    Write-Host "?? ????嚗雯蝡歇?????? -ForegroundColor Cyan
} else {
    Write-Host "撌脣?瘨??? -ForegroundColor Gray
}
