$port = 8080
$url = "http://localhost:$port/index.html"
$filePath = Join-Path $PSScriptRoot "index.html"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "奇幻歡樂島 - 本機測試啟動程式" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "直接開啟本機檔案: $filePath" -ForegroundColor Yellow
Write-Host "本機伺服器位址: $url" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

# 自動以預設瀏覽器開啟網頁
Start-Process $filePath

Write-Host "已為您在預設瀏覽器開啟奇幻歡樂島！" -ForegroundColor Green
Write-Host "您也可以透過 VS Code Live Server 或直接點擊 index.html 進行測試。" -ForegroundColor Gray