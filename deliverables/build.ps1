# =========================================================================
# Builds the self-contained pricing one-pager + PDF.
#   src  : pricing-one-pager.src.html   (font tokens)
#   out  : pricing-one-pager.html       (Geist Variable inlined as base64)
#   pdf  : Desktop\Mau Studio - Pricing.pdf
# =========================================================================

$ErrorActionPreference = "Stop"
$here    = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo    = Split-Path -Parent $here
$fonts   = Join-Path $repo "node_modules\geist\dist\fonts"
$src     = Join-Path $here "pricing-one-pager.src.html"
$out     = Join-Path $here "pricing-one-pager.html"
$desktop = [Environment]::GetFolderPath("Desktop")

# --- inline the variable fonts ------------------------------------------
$sansB64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$fonts\geist-sans\Geist-Variable.woff2"))
$monoB64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$fonts\geist-mono\GeistMono-Variable.woff2"))

$html = [IO.File]::ReadAllText($src)
$html = $html.Replace("__GEIST_SANS_B64__", $sansB64).Replace("__GEIST_MONO_B64__", $monoB64)
[IO.File]::WriteAllText($out, $html, (New-Object Text.UTF8Encoding $false))
Write-Host ("built  {0}  ({1:N0} KB)" -f (Split-Path $out -Leaf), ((Get-Item $out).Length / 1KB))

# --- render the PDF ------------------------------------------------------
$edge = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $edge) { Write-Warning "No Chromium browser found; skipped PDF."; return }

$pdf = Join-Path $desktop "Mau Studio - Pricing.pdf"
Remove-Item $pdf -Force -ErrorAction SilentlyContinue
$uri = "file:///" + ($out -replace '\\','/')

# Isolated profile: without it the headless run attaches to the user's already
# open Edge session and silently never writes the PDF.
$profile = Join-Path $env:TEMP "mau-pdf-profile"
& $edge --headless --disable-gpu --no-first-run --user-data-dir="$profile" `
        --no-pdf-header-footer --print-to-pdf="$pdf" $uri 2>$null

# poll rather than guess at a fixed sleep
for ($i = 0; $i -lt 30 -and -not (Test-Path $pdf); $i++) { Start-Sleep -Milliseconds 500 }
Start-Sleep -Milliseconds 500

Copy-Item $out (Join-Path $desktop "Mau Studio - Pricing.html") -Force

# publish into the dashboard so the Systems card can open it
$pub = Join-Path $repo "public\deliverables"
if (-not (Test-Path $pub)) { New-Item -ItemType Directory -Path $pub | Out-Null }
Copy-Item $out (Join-Path $pub "pricing-one-pager.html") -Force
if (Test-Path $pdf) { Copy-Item $pdf (Join-Path $pub "pricing-one-pager.pdf") -Force }
Write-Host "published to public\deliverables\"

if (Test-Path $pdf) {
  $txt   = [Text.Encoding]::GetEncoding(28591).GetString([IO.File]::ReadAllBytes($pdf))
  $pages = ([regex]::Matches($txt, '/Type\s*/Page[^s]')).Count
  $links = ([regex]::Matches($txt, '/Subtype\s*/Link')).Count
  Write-Host ("pdf    {0:N0} KB  ·  {1} page(s)  ·  {2} live link(s)" -f ((Get-Item $pdf).Length / 1KB), $pages, $links)
} else {
  Write-Warning "PDF was not produced."
}
