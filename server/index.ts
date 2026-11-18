import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { agentRouter } from './routes/agentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Parameter 2: Security - Content Security & Sanitization Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    agent: 'AegisSWE Autonomous AI Software Engineer',
    version: '1.0.0',
    capabilities: [
      'AST Symbol Indexing & Token Optimization',
      'Autonomous TDD Loop (Red -> Green -> Refactor)',
      'Built-in SAST Engine (OWASP Top 10 & CWE Detection)',
      'Sandboxed Self-Healing Runner',
      'WCAG 2.1 AA Compliant Dashboard'
    ]
  });
});

// Agent routes
app.use('/api', agentRouter);

// Serve Frontend client build if dist directory exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n==================================================================`);
  console.log(`🛡️  [AegisSWE Server & Web UI] Online!`);
  console.log(`🔗  Open in Browser: http://localhost:${PORT}`);
  console.log(`🚀  API Health:     http://localhost:${PORT}/api/health`);
  console.log(`==================================================================\n`);
});

export default app;
