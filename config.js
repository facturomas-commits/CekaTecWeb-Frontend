/* ============================================================
   CONFIGURACIÓN DE DESPLIEGUE
   Define a qué API llama el frontend.

   - En local (localhost / 127.0.0.1): cadena vacía = mismo origen.
     La API sirve la página y responde en /api/v1.
   - Publicado (crm.ceka.com.ar): usa el túnel de Cloudflare
     que expone la API de la PC Windows como api.ceka.com.ar.

   Si algún día el frontend y la API comparten dominio (proxy),
   alcanza con dejar la cadena vacía en ambos casos.
   ============================================================ */
(function () {
  var local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  window.CM_API_URL = local ? "" : "https://api.ceka.com.ar/api/v1";
})();
