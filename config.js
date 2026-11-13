/* ============================================================
   CONFIGURACIÓN DE DESPLIEGUE

   Con este esquema el frontend y la API se ven como el mismo
   origen: el server.js de Node sirve la página y hace de proxy
   de /api hacia la API Delphi (PC Windows).

   Por eso la URL queda vacía: la app usa el mismo dominio.

   Solo habría que completarla si algún día se publica el
   frontend en un dominio y la API en otro distinto.
   ============================================================ */
window.CM_API_URL = "";
