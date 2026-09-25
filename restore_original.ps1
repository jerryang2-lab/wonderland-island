# restore_original.ps1
# 一鍵安全還原回原版本 (2026-09-25 改版前初始狀態)

$backupSource = Join-Path $PSScriptRoot "_backups\backup_original_20260925_pre_words"

if (-not (Test-Path $backupSource)) {
    Write-Error "找不到備份目錄: $backupSource"
    exit 1
}

Write-Host "======================================================" -ForegroundColor Yellow
Write-Host "⚠️ 即將將網站完整還原為 2026-09-25 原版本狀態..." -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Yellow

$confirm = Read-Host "確定要執行還原嗎？(Y/N)"
if ($confirm -eq "Y" -or $confirm -eq "y") {
    $items = Get-ChildItem -Path $backupSource
    foreach ($item in $items) {
        $dest = Join-Path $PSScriptRoot $item.Name
        Copy-Item -Path $item.FullName -Destination $dest -Recurse -Force
        Write-Host "  已還原: $($item.Name)" -ForegroundColor Green
    }
    Write-Host "🎉 還原成功！網站已回到初始狀態。" -ForegroundColor Cyan
} else {
    Write-Host "已取消還原。" -ForegroundColor Gray
}
