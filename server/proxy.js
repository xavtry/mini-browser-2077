const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..'))); // serve frontend

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('ERROR: No URL');

  createProxyMiddleware({
    target: url,
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: (proxyRes, req, res) => {
      // Fix CORS + security headers
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['x-frame-options'];
      proxyRes.headers['access-control-allow-origin'] = '*';
    },
    onError: (err, req, res) => {
      res.status(500).send(`
        <h1 style="color:#f00;font-family:monospace">CONNECTION FAILED</h1>
        <p>${err.message}</p>
      `);
    }
  })(req, res);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('\nMINI BROWSER 2077 IS ALIVE');
  console.log(`→ Proxy running on http://localhost:${PORT}`);
  console.log(`→ Open index.html — Night City awaits.\n`);
});
