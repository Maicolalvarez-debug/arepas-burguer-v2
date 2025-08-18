# scripts/auditar.ps1
param(
  [string]$Salida = "reporte_proyecto.md"
)

$ErrorActionPreference = "SilentlyContinue"

function Run($cmd, $title) {
  Write-Host "`n=== $title ===`n" -ForegroundColor Cyan
  "`n## $title`n" | Out-File -FilePath $Salida -Append -Encoding utf8

  try {
    $output = & $cmd 2>&1
    if (-not $output) { $output = "(sin salida)" }
    $output | Out-File -FilePath $Salida -Append -Encoding utf8
  } catch {
    "[ERROR] $_" | Out-File -FilePath $Salida -Append -Encoding utf8
  }
}

# Limpiar reporte previo
"# Reporte de proyecto ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))`n" | Out-File -FilePath $Salida -Encoding utf8

# 1. Info de entorno
Run { node -v } "Node version"
Run { npm -v } "npm version"
Run { npx envinfo --system --binaries --browsers --npmPackages next,react,react-dom,typescript,eslint,prisma --markdown } "Envinfo"

# 2. Dependencias
if (Test-Path node_modules) {
  Run { npm ci --prefer-offline } "Instalar dependencias (ci)"  
} else {
  Run { npm install } "Instalar dependencias (install)"
}

# 3. Árbol de archivos
"`n## Árbol de archivos (carpetas clave)`n" | Out-File -FilePath $Salida -Append -Encoding utf8
$paths = @("app","pages","src","components","prisma","public")
foreach ($p in $paths) {
  if (Test-Path $p) {
    "`n### $p`n" | Out-File -FilePath $Salida -Append -Encoding utf8
    (Get-ChildItem $p -Recurse | Select-Object FullName) | ForEach-Object { $_.FullName } | Out-File -FilePath $Salida -Append -Encoding utf8
  }
}

# 4. Validaciones
# 4.1 TypeScript
if (Test-Path tsconfig.json) { Run { npx tsc --noEmit } "TypeScript (tsc --noEmit)" }

# 4.2 ESLint / Next Lint
if (Test-Path .eslintrc* -or (Get-Content package.json | Select-String '"lint"')) {
  Run { npm run lint } "ESLint/Next Lint"
}

# 4.3 Prisma
if (Test-Path prisma) {
  Run { npx prisma validate } "Prisma validate"
  Run { npx prisma generate } "Prisma generate"
  Run { npx prisma migrate status } "Prisma migrate status"
}

# 5. Build de Next.js
if ((Get-Content package.json | Select-String '"build"')) {
  Run { npm run build } "Next.js build"
}

# 6. Servidor de desarrollo (instrucción)
if ((Get-Content package.json | Select-String '"dev"')) {
  "`n## Dev (prueba)`n" | Out-File -FilePath $Salida -Append -Encoding utf8
  "Para correr manualmente: npm run dev" | Out-File -FilePath $Salida -Append -Encoding utf8
}

Write-Host "`nReporte generado en: $Salida" -ForegroundColor Green
