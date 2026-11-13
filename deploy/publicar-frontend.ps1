# Publica el frontend (index.html + tailwind.css) en el servidor Ubuntu.
# Uso:
#   .\deploy\publicar-frontend.ps1 -Servidor 203.0.113.10 -Usuario root -Destino /var/www/crm.ceka.com.ar

param(
  [Parameter(Mandatory = $true)][string]$Servidor,
  [string]$Usuario = 'root',
  [string]$Destino = '/var/www/crm.ceka.com.ar',
  [string]$Clave = ''       # opcional: ruta a una clave .pem
)

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$archivos = @('index.html', 'tailwind.css', 'config.js')

foreach ($a in $archivos) {
  if (-not (Test-Path (Join-Path $raiz $a))) {
    throw "No se encontro $a en $raiz"
  }
}

$destinoRemoto = "$Usuario@${Servidor}:$Destino/"
Write-Host "Publicando frontend en $destinoRemoto"

$scp = 'C:\WINDOWS\System32\OpenSSH\scp.exe'
$opciones = @()
if ($Clave -ne '') { $opciones += @('-i', $Clave) }

# Crear la carpeta destino (por si no existe)
$ssh = 'C:\WINDOWS\System32\OpenSSH\ssh.exe'
& $ssh @opciones "$Usuario@$Servidor" "mkdir -p $Destino"
if ($LASTEXITCODE -ne 0) { throw "No se pudo conectar por SSH a $Servidor" }

foreach ($a in $archivos) {
  & $scp @opciones (Join-Path $raiz $a) $destinoRemoto
  if ($LASTEXITCODE -ne 0) { throw "Fallo la copia de $a" }
  Write-Host "  OK $a"
}

Write-Host ""
Write-Host "Listo. En el servidor:"
Write-Host "  sudo chown -R www-data:www-data $Destino"
Write-Host "  sudo nginx -t && sudo systemctl reload nginx"
