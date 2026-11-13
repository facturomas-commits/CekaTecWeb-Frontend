# Despliegue del frontend (Core Manager)

## Arquitectura real del servidor `ubuntu25`

- **Easypanel** (puerto 3000) administra los servicios.
- **Traefik** publica 80/443 y emite los certificados (lo controla Easypanel).
- Hay un **Cloudflare Tunnel** en contenedor: los dominios entran por ahí.
- Las otras apps Node (dashboard-app, web-teadem, articulacion-2026) corren por `pm2`
  fuera de Docker.

Por eso el frontend se publica como **App de Easypanel** con el `Dockerfile` de este repo.
No se toca ninguna de las apps existentes.

## 1. API primero (queda en la PC Windows)

La API es un `.exe` Delphi: no corre en Linux. Se expone con un túnel de Cloudflare
desde **la PC Windows** (no desde el servidor, que está en otra red):

```powershell
# 1) instalar cloudflared (una vez)
winget install --id Cloudflare.cloudflared

# 2) loguearse y crear el túnel
cloudflared tunnel login
cloudflared tunnel create ceka-api

# 3) publicar api.ceka.com.ar -> localhost:8080
cloudflared tunnel route dns ceka-api api.ceka.com.ar
cloudflared tunnel run --url http://localhost:8080 ceka-api

# 4) instalarlo como servicio para que arranque con Windows
cloudflared service install
```

Verificar: `https://api.ceka.com.ar/health` debe responder `{"status":"ok",...}`.

En `Backend\config.json` agregar el origen del frontend:

```json
"corsOrigenes": "http://localhost:8080,https://crm.ceka.com.ar"
```

## 2. Configurar el frontend

En `config.js`:

```js
window.CM_API_URL = "https://api.ceka.com.ar/api/v1";
```

(Si algún día el servidor puede llegar a la PC por red interna, se puede dejar vacío
y proxear `/api/` desde el contenedor.)

## 3. Crear la App en Easypanel

1. Entrar a `http://IP_DEL_SERVIDOR:3000`.
2. **Create → App** (o *Project → App*), nombre `ceka-crm`.
3. **Source**: GitHub → repositorio `CekaTecWeb-Frontend`, rama `main`.
   - Si el repo es privado, Easypanel pide un token o deploy key.
4. **Build**: Dockerfile (el del repo).
5. **Port**: `80`.
6. **Domains**: `crm.ceka.com.ar` (Easypanel crea el router de Traefik y el
   certificado Let's Encrypt).
7. **Deploy**.

Cada `git push` a `main` se puede redeployar desde el botón **Deploy** (o activar
*Auto Deploy* en Easypanel).

## 4. Verificación

```bash
curl -I https://crm.ceka.com.ar            # 200
curl -s https://crm.ceka.com.ar/config.js  # muestra window.CM_API_URL
curl -s https://api.ceka.com.ar/health     # API + base de datos
```

## Alternativa sin Docker

En este servidor **no hay nginx en el host**, así que la publicación tiene que ser por
Easypanel (contenedor) o agregando una cuarta app a pm2 en el puerto 3302 y una ruta en
Traefik. El script `deploy/publicar-frontend.ps1` sirve solo si más adelante montás un
nginx propio.
