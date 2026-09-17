import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Health check endpoint for container and platform monitoring
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Serve static assets from project root with html extensions supported
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Route handlers for clean paths
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/business', (_req, res) => {
  res.sendFile(path.join(__dirname, 'business.html'));
});

// Fallback to index.html for any SPA / unknown route
app.use((_req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

// Global error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).send('Internal Server Error');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Listen on port 3000
app.listen(PORT, () => {
  console.log(`[INFO] Server started on port ${PORT}. Ready on http://localhost:${PORT}`);
});

export default app;
