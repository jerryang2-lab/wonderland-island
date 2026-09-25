$ErrorActionPreference = "Stop"

Set-Location -Path $PSScriptRoot

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Wonderland Island - Rollback Utility" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# Get recent release tags
$tags = git tag -l "release-*" --sort=-creatordate
if (-not $tags) {
    Write-Warning "No release-* tags found!"
    Write-Host "To discard uncommitted local changes, run: git restore . ; git clean -fd" -ForegroundColor Yellow
    exit
}

$tagList = @($tags | Select-Object -First 10)
Write-Host "Recent release version tags:" -ForegroundColor Yellow
for ($i = 0; $i -lt $tagList.Count; $i++) {
    $t = $tagList[$i]
    $tagMsg = git tag -n1 -l $t
    Write-Host "  [$i] $tagMsg" -ForegroundColor Cyan
}
Write-Host "------------------------------------------------------"

$choice = Read-Host "Enter version number to rollback to (0-$($tagList.Count - 1)), or Q to quit"
if ($choice -eq "Q" -or $choice -eq "q" -or $choice -eq "") {
    Write-Host "Cancelled." -ForegroundColor Gray
    exit
}

if ($choice -match '^[0-9]+$' -and [int]$choice -lt $tagList.Count) {
    $selectedTag = $tagList[[int]$choice]
    Write-Host ""
    $confirm = Read-Host "WARNING: All working files will revert to [$selectedTag] state! Proceed? (Y/N)"
    if ($confirm -eq "Y" -or $confirm -eq "y") {
        Write-Host "Checking out historical tag files..." -ForegroundColor Cyan
        git checkout $selectedTag -- .

        $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "Creating rollback commit..." -ForegroundColor Cyan
        git commit -m "rollback: Reverted to $selectedTag [$now]"

        $hasRemote = git remote
        if ($hasRemote) {
            Write-Host "Pushing rollback commit to GitHub..." -ForegroundColor Cyan
            git push origin main
        }
        Write-Host ""
        Write-Host "Successfully restored to [$selectedTag]!" -ForegroundColor Green
    } else {
        Write-Host "Rollback cancelled." -ForegroundColor Gray
    }
} else {
    Write-Host "Invalid choice, aborting." -ForegroundColor Red
}