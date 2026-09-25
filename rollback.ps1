$ErrorActionPreference = "Stop"

Set-Location -Path $PSScriptRoot

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "🔄 奇幻歡樂島 (website) - 歷史版本還原輔助工具" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 取得最近的發布標籤
$tags = git tag -l "release-*" --sort=-creatordate
if (-not $tags) {
    Write-Warning "目前儲存庫尚未建立任何 release-* 標籤！"
    Write-Host "若要撤銷尚未 Commit 的修改，可執行: git restore . ; git clean -fd" -ForegroundColor Yellow
    exit
}

$tagList = $tags | Select-Object -First 5
Write-Host "最近 5 次發布的時間戳記版本清單：" -ForegroundColor Yellow
for ($i = 0; $i -lt $tagList.Count; $i++) {
    $t = $tagList[$i]
    $tagMsg = git tag -n1 -l $t
    Write-Host "  [$i] $tagMsg" -ForegroundColor Cyan
}
Write-Host "------------------------------------------------------"

$choice = Read-Host "請輸入欲還原的版本編號 (0-$($tagList.Count - 1))，或輸入 Q 離開"
if ($choice -eq "Q" -or $choice -eq "q" -or $choice -eq "") {
    Write-Host "取消操作。" -ForegroundColor Gray
    exit
}

if ($choice -match '^[0-9]+$' -and [int]$choice -lt $tagList.Count) {
    $selectedTag = $tagList[[int]$choice]
    Write-Host ""
    $confirm = Read-Host "⚠️ 注意：這將會把所有網頁檔案還原至 [$selectedTag] 的狀態！確定還原並推送到 GitHub 嗎？(Y/N)"
    if ($confirm -eq "Y" -or $confirm -eq "y") {
        Write-Host "📦 正在提取歷史標籤檔案狀態..." -ForegroundColor Cyan
        git checkout $selectedTag -- .

        $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "📝 建立回滾提交 (Rollback Commit)..." -ForegroundColor Cyan
        git commit -m "rollback: 內容不符預期，回滾至歷史版本 $selectedTag [$now]"

        Write-Host "☁️  推送到 GitHub 覆蓋線上最新版..." -ForegroundColor Cyan
        git push origin main

        Write-Host ""
        Write-Host "🎉 成功還原至 [$selectedTag]，線上網站將於數分鐘內回退完畢！" -ForegroundColor Green
    } else {
        Write-Host "使用者已取消還原。" -ForegroundColor Gray
    }
} else {
    Write-Host "無效的編號，操作終止。" -ForegroundColor Red
}
