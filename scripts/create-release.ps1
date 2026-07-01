param(
  [string]$OutputDirectory = "dist"
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$output = Join-Path $root $OutputDirectory
$commit = (git -C $root rev-parse --short HEAD).Trim()
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archive = Join-Path $output "ttautosengineering-$stamp-$commit.tar.gz"

New-Item -ItemType Directory -Force -Path $output | Out-Null
git -C $root archive --format=tar.gz --output=$archive HEAD
Write-Output "Created $archive"
