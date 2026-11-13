# Despliegue de CekaTec / Core Manager

## Qué se publica en Ubuntu

**Solo el frontend** (3 archivos): `index.html`, `tailwind.css` y `config.js`.
La API (`CoreManager.Api.exe`, Delphi Win64) **queda en la PC Windows** porque no
corre nativo en Linux.

## Configuración de la API (`config.js`)

Antes de publicar, definí a dónde va a llamar el frontend. Hay dos casos:

**Caso A — nginx hace de proxy (recomendado):** el frontend y la API se ven como el
mismo dominio, no hay CORS y no hace falta tocar nada.

```js
window.CM_API_URL = "";
```

```nginx
location /api/ { proxy_pass http://IP_PC_WINDOWS:8080; }
```

**Caso B — la API tiene su propio dominio:** el frontend llama directo a la API.

```js
window.CM_API_URL = "https://api.ceka.com.ar/api/v1";
```

> Si el frontend se sirve por **HTTPS**, la API también debe ser **HTTPS**
> (el navegador bloquea `http://` desde una página `https://`).
> En ese caso hay que agregar `https://crm.ceka.com.ar` en `corsOrigenes`.

---

## Arquitectura

```
Navegador → https://crm.ceka.com.ar (Ubuntu + nginx)
                     │
                     ├── /              → archivos estáticos (index.html, tailwind.css, config.js)
                     └── /api/v1/...    → proxy a la PC Windows con la API (puerto 8080)
```

La PC Windows con la API tiene que ser **alcanzable desde el Ubuntu**: misma red, VPN
(Tailscale/WireGuard) o IP pública con el puerto restringido a la IP del servidor.

---

## 1. Publicar el frontend

```powershell
# desde D:\CekaTecWeb
.\deploy\publicar-frontend.ps1 -Servidor 203.0.113.10 -Usuario root -Destino /var/www/crm.ceka.com.ar
```

Copia `index.html` y `tailwind.css`. En el servidor:

```bash
sudo mkdir -p /var/www/crm.ceka.com.ar
sudo chown -R www-data:www-data /var/www/crm.ceka.com.ar
sudo cp deploy/nginx-crm.conf /etc/nginx/sites-available/crm.ceka.com.ar
sudo ln -s /etc/nginx/sites-available/crm.ceka.com.ar /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d crm.ceka.com.ar     # HTTPS
```

> Las otras 3 aplicaciones Node siguen funcionando igual: esto agrega un `server block`
> nuevo en nginx y una carpeta nueva. No toca las existentes.

---

## 2. API en la PC Windows

1. Editar `Backend\config.json`:
   - `"corsOrigenes"`: dejar `https://crm.ceka.com.ar` (aunque con el proxy no se usa).
   - `"puerto": 8080`.
2. La API hoy arranca con la Tarea Programada **CoreManager API**. Para producción conviene
   correrla como **servicio de Windows** (NSSM o `sc.exe`) para que se reinicie sola.
3. Abrir el puerto 8080 **solo** para la IP del servidor Ubuntu (firewall de Windows):

```powershell
New-NetFirewallRule -DisplayName "CoreManager API (solo Ubuntu)" -Direction Inbound `
  -Protocol TCP -LocalPort 8080 -RemoteAddress 203.0.113.10 -Action Allow
```

4. Verificar desde Ubuntu:

```bash
curl http://IP_DE_LA_PC_WINDOWS:8080/health
```

Si no hay red directa entre ambos, usar **Tailscale** (instalar en los dos y usar la IP
`100.x.x.x` en el `proxy_pass`).

---

## 3. Alternativa: todo en Windows

Si preferís no exponer la API, se puede publicar igual que Facturomas: el propio
`CoreManager.Api.exe` sirve el frontend (`webDir` apunta a `D:\CekaTecWeb`) y se publica
el dominio directo a esa PC. No hace falta Ubuntu.
