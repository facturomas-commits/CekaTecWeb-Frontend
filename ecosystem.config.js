module.exports = {
  apps: [{
    name: 'ceka-crm',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    max_memory_restart: '200M',
    env: {
      PORT: 3302,
      BACKEND_URL: 'http://172.168.20.183:8080'
    }
  }]
};
