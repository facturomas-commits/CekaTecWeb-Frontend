# Core Manager — Frontend

SPA de un solo archivo (`index.html`) + Tailwind compilado localmente.
Consume la API **Core Manager** (Delphi Horse + PostgreSQL) por HTTPS/HTTP.

## Archivos que se publican

| Archivo | Descripción |
|---|---|
| `index.html` | Aplicación completa (HTML + CSS propio + JS) |
| `tailwind.css` | Utilities de Tailwind compiladas |
| `config.js` | URL de la API (`window.CM_API_URL`) |

## Configuración de la API

`config.js` define a dónde llama el frontend:

```js
window.CM_API_URL = "";                                  // mismo dominio (nginx proxy /api → API)
window.CM_API_URL = "https://api.ceka.com.ar/api/v1";    // API en otro dominio
```

Si se publica por **HTTPS**, la API también debe ser **HTTPS** (el navegador bloquea
llamadas `http://` desde una página `https://`) y el origen debe estar en
`corsOrigenes` del backend.

## Compilar los estilos

```bash
npm install
npm run build:css      # genera tailwind.css
npm run watch:css      # modo desarrollo
```

## Publicar en el servidor (Ubuntu)

```powershell
.\deploy\publicar-frontend.ps1 -Servidor 203.0.113.10 -Usuario root -Destino /var/www/crm.ceka.com.ar
```

Vhost de nginx listo en `deploy/nginx-crm.conf` (sirve estáticos y hace proxy de
`/api/` hacia la PC Windows donde corre la API).

## Estructura

```
index.html            aplicación
tailwind.css          estilos compilados (generado)
config.js             URL de la API
src/input.css         entrada de Tailwind
tailwind.config.js    configuración de Tailwind
deploy/               vhost nginx + script de publicación + guía
```

## Roles de la aplicación

La interfaz se adapta a los permisos que devuelve la API: el personal interno ve todos
los módulos y el **portal del cliente** muestra solo su empresa (equipos, tickets,
servicios, presupuestos y reportes).
