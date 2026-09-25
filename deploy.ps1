param (
    [Parameter(Mandatory=$false)]
    [string]$Message = "網頁介面與功能例行更新"
)

$ErrorActionPreference = "Stop"

# 確認目前路徑在專案目錄
Set-Location -Path $PSScriptRoot

$now = Get-Date
$timestamp = $now.ToString("yyyy-MM-dd HH:mm:ss")
$tagStamp = $now.ToString("yyyyMMdd-HHmmss")
$tagName = "release-$tagStamp"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "🚀 準備部署 website 至 GitHub..." -ForegroundColor Cyan
Write-Host "🕒 時間戳記: $timestamp" -ForegroundColor Yellow
Write-Host "🏷️  版本標籤: $tagName" -ForegroundColor Yellow
Write-Host "📝 變更摘要: $Message" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

# 1. 寫入或追加部署時間戳紀錄至 DEPLOY_LOG.md
$logFile = Join-Path $PSScriptRoot "DEPLOY_LOG.md"
if (-not (Test-Path $logFile)) {
    @"
# 奇幻歡樂島 - 部署與發布時間戳日誌 (Deployment Log)

| 部署時間 (Timestamp) | 發布標籤 (Tag) | 操作者 | 變更摘要 |
| :--- | :--- | :--- | :--- |
"@ | Out-File -FilePath $logFile -Encoding utf8
}
"| $timestamp | $tagName | $env:USERNAME | $Message |" | Out-File -FilePath $logFile -Append -Encoding utf8

# 2. 暫存變更並提交 Commit
Write-Host "📦 [1/3] 暫存檔案並建立提交..." -ForegroundColor Cyan
git add .
$commitStatus = git status --porcelain
if (-not $commitStatus) {
    Write-Host "⚠️ 沒有偵測到任何檔案修改，跳過 Commit。" -ForegroundColor Yellow
} else {
    git commit -m "deploy: $Message [$timestamp]"
}

# 3. 建立帶註解之時間戳記標籤
Write-Host "🏷️  [2/3] 建立 Git 發布標籤: $tagName..." -ForegroundColor Cyan
git tag -a $tagName -m "部署於 $timestamp - $Message"

# 4. 推送至 GitHub
Write-Host "☁️  [3/3] 推送程式碼與標籤至 GitHub (origin main)..." -ForegroundColor Cyan
git push origin main --tags

Write-Host ""
Write-Host "🎉 部署完成！GitHub Pages 將自動偵測並於數分鐘內完成線上更新。" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
