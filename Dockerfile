# Imagen estática del frontend Core Manager (para Easypanel / Docker)
FROM nginx:alpine

COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY index.html tailwind.css config.js /usr/share/nginx/html/

EXPOSE 80
