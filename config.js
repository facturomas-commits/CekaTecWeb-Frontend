/* ============================================================
   CONFIGURACIÓN DE DESPLIEGUE
   Este archivo NO se compila: se edita según dónde se publique
   el frontend.

   - Si el frontend y la API comparten el mismo dominio
     (por ejemplo nginx con proxy /api hacia la PC Windows),
     dejar la cadena vacía:

        window.CM_API_URL = "";

   - Si el frontend se publica en Ubuntu y la API queda en otra
     máquina con su propio dominio, poner la URL completa:

        window.CM_API_URL = "https://api.ceka.com.ar/api/v1";

   Nota: si el frontend se sirve por HTTPS, la API también debe
   ser HTTPS (el navegador bloquea llamadas a http:// desde https://).
   ============================================================ */
window.CM_API_URL = "";
