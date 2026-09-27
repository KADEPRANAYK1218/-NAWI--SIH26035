import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

process.env.VITE_FULLSTACK = 'true';

// Import backend Express app with initialized database and API routes
// @ts-ignore
import backendApp from './backend/src/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.NODE_ENV === 'production' && process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Mount the backend app (handles /api/auth, /api/instruments, /api/tests, /api/reports, /api/users, /uploads, etc.)
  app.use(backendApp);

  if (!isProd) {
    // Development mode: mount Vite dev server as middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NAWI Full-Stack Server] Serving on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
