const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://haveibeenpwned.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // réécriture de chemin
      },
    })
  );
};
