$ErrorActionPreference = "Stop"

Set-Location -Path $PSScriptRoot

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "?? 憟劂甇⊥?撜?(website) - 甇瑕???頛撌亙" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# ???餈??澆?璅惜
$tags = git tag -l "release-*" --sort=-creatordate
if (-not $tags) {
    Write-Warning "?桀??脣?摨怠??芸遣蝡遙雿?release-* 璅惜嚗?
    Write-Host "?亥??日撠 Commit ?耨?對??臬銵? git restore . ; git clean -fd" -ForegroundColor Yellow
    exit
}

$tagList = $tags | Select-Object -First 5
Write-Host "?餈?5 甈∠撣????唾??皜嚗? -ForegroundColor Yellow
for ($i = 0; $i -lt $tagList.Count; $i++) {
    $t = $tagList[$i]
    $tagMsg = git tag -n1 -l $t
    Write-Host "  [$i] $tagMsg" -ForegroundColor Cyan
}
Write-Host "------------------------------------------------------"

$choice = Read-Host "隢撓?交炬?????祉楊??(0-$($tagList.Count - 1))嚗?頛詨 Q ?ａ?"
if ($choice -eq "Q" -or $choice -eq "q" -or $choice -eq "") {
    Write-Host "?????? -ForegroundColor Gray
    exit
}

if ($choice -match '^[0-9]+$' -and [int]$choice -lt $tagList.Count) {
    $selectedTag = $tagList[[int]$choice]
    Write-Host ""
    $confirm = Read-Host "?? 瘜冽?嚗?????雯??獢?? [$selectedTag] ????蝣箏???銝行? GitHub ??(Y/N)"
    if ($confirm -eq "Y" -or $confirm -eq "y") {
        Write-Host "? 甇???甇瑕璅惜瑼????.." -ForegroundColor Cyan
        git checkout $selectedTag -- .

        $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "?? 撱箇??遝?漱 (Rollback Commit)..." -ForegroundColor Cyan
        git commit -m "rollback: ?批捆銝泵??嚗?皛曇甇瑕? $selectedTag [$now]"

        Write-Host "??  ?券 GitHub 閬?蝺???啁?..." -ForegroundColor Cyan
        git push origin main

        Write-Host ""
        Write-Host "?? ??????[$selectedTag]嚗?銝雯蝡??潭???批??摰嚗? -ForegroundColor Green
    } else {
        Write-Host "雿輻?歇?????? -ForegroundColor Gray
    }
} else {
    Write-Host "?⊥??楊????蝯迫?? -ForegroundColor Red
}
