'use strict';

// Frontend Core Manager (SPA) + proxy a la API Delphi que corre en Windows.
// Mismo patrón que web-teadem / dashboard-app.

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = process.env.PORT || 3302;
const BACKEND_URL = process.env.BACKEND_URL || 'http://172.168.20.183:8080';

const app = express();
app.disable('x-powered-by');

// 1) API (Horse/Delphi en la PC Windows) y health
app.use(createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  xfwd: true,
  proxyTimeout: 180000,
  timeout: 180000,
  pathFilter: (ruta) => ruta.indexOf('/api') === 0 || ruta === '/health',
}));

// 2) Archivos del frontend (sin cachear el HTML ni la config)
const sinCache = (res) => res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
app.get(['/', '/index.html'], (req, res) => { sinCache(res); res.sendFile(path.join(__dirname, 'index.html')); });
app.get('/config.js', (req, res) => { sinCache(res); res.sendFile(path.join(__dirname, 'config.js')); });
app.get('/tailwind.css', (req, res) => res.sendFile(path.join(__dirname, 'tailwind.css')));

// 3) Cualquier otra ruta vuelve a la SPA
app.get('*', (req, res) => { sinCache(res); res.sendFile(path.join(__dirname, 'index.html')); });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Core Manager web escuchando en http://0.0.0.0:${PORT}`);
  console.log(`API proxy -> ${BACKEND_URL}`);
});
