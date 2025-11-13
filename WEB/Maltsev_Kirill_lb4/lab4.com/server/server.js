const express = require('express');
const https = require('https');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Proxy для API запросов к lab3 (чтобы избежать CORS)
app.use('/api', (req, res) => {
  const options = {
    hostname: 'localhost',
    port: 3112,
    path: '/api' + req.url,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
    },
    rejectUnauthorized: false // Игнорируем self-signed сертификат
  };

  const proxyReq = https.request(options, (proxyRes) => {
    // Копируем headers от lab3
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });
    
    res.status(proxyRes.statusCode);
    
    let body = '';
    proxyRes.on('data', chunk => {
      body += chunk;
    });
    
    proxyRes.on('end', () => {
      res.send(body);
    });
  });

  proxyReq.on('error', (error) => {
    console.error('Ошибка proxy запроса:', error.message);
    console.error('   Убедитесь что lab3 запущен на https://localhost:3112');
    res.status(500).json({ error: 'Ошибка соединения с сервером администрирования' });
  });

  if (req.body && Object.keys(req.body).length > 0) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  proxyReq.end();
});

// Отдача статических файлов Angular
app.use(express.static(path.join(__dirname, '../client/dist/social-network-client')));

// Все остальные маршруты - отдаём Angular приложение (для роутинга)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../client/dist/social-network-client/index.html');
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;
