<#
============================================================================
憟劂甇⊥?撜?(Wonderland Island) - 蝔?蝣潭毽瘛?摰撱箇蔭撌亙 (Build & Obfuscate Pipeline)
----------------------------------------------------------------------------
Copyright (c) 2026 Jerry Ang / Wonderland Island Team. All Rights Reserved.
?祈?砍?撠???蝣潮脰?摰瘛瑟???蝮桐蒂瘜典??摰??嚗?箇撣??祆 dist/ ?桅???============================================================================
#>

[CmdletBinding()]
param(
    [string]$SourceDir = "",
    [string]$DistDir = ""
)

if (-not $SourceDir) {
    $SourceDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
}
if (-not $DistDir) {
    $DistDir = Join-Path $SourceDir "dist"
}

Write-Host ">>> [Wonderland Island] Starting secure build and obfuscation..." -ForegroundColor Cyan

# 1. 撱箇? dist ?桅?
if (Test-Path $DistDir) {
    Write-Host "Cleaning dist..." -ForegroundColor Yellow
    Remove-Item -Path $DistDir -Recurse -Force
}
New-Item -ItemType Directory -Path (Join-Path $DistDir "js") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $DistDir "css") -Force | Out-Null

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# 2. 摰儔摰?? Header
$legalHeader = @"
/**
 * 憟劂甇⊥?撜?(Wonderland Island) - 甇???澆???(Obfuscated Production Bundle)
 * Copyright (c) 2026 Jerry Ang / Wonderland Island Team. All Rights Reserved.
 * ?祉?撘Ⅳ?葉?舀???雿?瘜??箸鞎∠甈?霅瘀??芰??賊閮勗?渡?隞颱?銴ˊ?撣?頛??楊霅胯? */
"@

# 3. ?? JS 璅∠?
$jsFiles = Get-ChildItem -Path (Join-Path $SourceDir "js") -Filter "*.js"
foreach ($file in $jsFiles) {
    Write-Host "Packing JS: $($file.Name)..." -ForegroundColor Green
    $code = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

    $lines = $code -split "`r?`n"
    $filteredLines = New-Object System.Collections.Generic.List[string]
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed.StartsWith("//") -and -not $trimmed.Contains("Copyright") -and -not $trimmed.Contains("http")) {
            continue
        }
        $filteredLines.Add($line)
    }
    $minified = ($filteredLines -join "`n")

    $finalJs = $legalHeader + "`n`n" + $minified
    $destPath = Join-Path $DistDir "js\$($file.Name)"
    [System.IO.File]::WriteAllText($destPath, $finalJs, $utf8NoBom)
}

# 4. ?? CSS 璅??
$cssFiles = Get-ChildItem -Path (Join-Path $SourceDir "css") -Filter "*.css"
foreach ($file in $cssFiles) {
    Write-Host "Packing CSS: $($file.Name)..." -ForegroundColor Green
    $cssCode = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    $minCss = $cssCode -replace '/\*[\s\S]*?\*/', ''
    $minCss = $minCss -replace '\s+', ' '
    $minCss = $minCss -replace ' ?([\{\}\:\;\,]) ?', '$1'
    
    $finalCss = "/* Copyright (c) 2026 Jerry Ang / Wonderland Island Team. All Rights Reserved. */`n" + $minCss.Trim()
    $destPath = Join-Path $DistDir "css\$($file.Name)"
    [System.IO.File]::WriteAllText($destPath, $finalCss, $utf8NoBom)
}

# 5. 銴ˊ銝駁??Ｚ?瘜??辣
Write-Host "Copying index.html and COPYRIGHT.md..." -ForegroundColor Green
Copy-Item (Join-Path $SourceDir "index.html") (Join-Path $DistDir "index.html") -Force
Copy-Item (Join-Path $SourceDir "COPYRIGHT.md") (Join-Path $DistDir "COPYRIGHT.md") -Force
if (Test-Path (Join-Path $SourceDir "README.md")) {
    Copy-Item (Join-Path $SourceDir "README.md") (Join-Path $DistDir "README.md") -Force
}

Write-Host "`n>>> [SUCCESS] Build completed! Artifacts written to: $DistDir" -ForegroundColor Cyan