# Despliegue del frontend (Core Manager)

Mismo patrón que **web-teadem** y **dashboard-app**: una app de Node en pm2 que sirve
los archivos estáticos y hace de proxy hacia la API Delphi (PC Windows).

```
Navegador → crm.ceka.com.ar (Traefik/Cloudflare) → 127.0.0.1:3302 (pm2: ceka-crm)
                                                        └── /api/... → 172.168.20.183:8080 (API Delphi)
```

Al compartir el mismo origen, el navegador no ve CORS y `config.js` queda vacío.

## Archivos

| Archivo | Rol |
|---|---|
| `index.html`, `tailwind.css`, `config.js` | Frontend |
| `server.js` | Express: sirve el frontend y proxea `/api` |
| `ecosystem.config.js` | pm2: app `ceka-crm`, puerto 3302 |
| `package.json` | express + http-proxy-middleware |

## Instalación en el servidor (una vez)

```bash
cd /opt
git clone https://github.com/facturomas-commits/CekaTecWeb-Frontend.git ceka-crm
cd ceka-crm
npm ci --omit=dev
pm2 start ecosystem.config.js
pm2 save
pm2 list                      # debe aparecer ceka-crm online en :3302
```

## Actualizaciones

```bash
cd /opt/ceka-crm && git pull && npm ci --omit=dev && pm2 restart ceka-crm
```

## Dominio

El sitio queda en `127.0.0.1:3302`. Hay que publicarlo igual que `web-teadem`:

- Si el dominio entra por **Traefik/Easypanel** → crear el servicio/route
  `crm.ceka.com.ar → http://127.0.0.1:3302`.
- Si entra por el **Cloudflare Tunnel** → agregar el hostname
  `crm.ceka.com.ar → http://localhost:3302` en el túnel.

## Firewall de la PC Windows

La API tiene que aceptar conexiones desde el servidor:

```powershell
New-NetFirewallRule -DisplayName "CoreManager API (red interna)" -Direction Inbound `
  -Protocol TCP -LocalPort 8080 -RemoteAddress 172.168.20.0/24 -Action Allow
```

## Verificación

```bash
curl -I https://crm.ceka.com.ar            # 200 (index.html)
curl https://crm.ceka.com.ar/config.js     # window.CM_API_URL = "";
curl https://crm.ceka.com.ar/health        # {"status":"ok","database":"ok"}
```

## Docker / Easypanel (alternativa)

El repo también incluye `Dockerfile` y `docker/default.conf` por si preferís publicarlo
como App de Easypanel en lugar de pm2. En ese caso el contenedor debe poder alcanzar
`http://172.168.20.183:8080` (misma red).
