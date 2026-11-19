import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, type ChildProcess } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const FASTAPI_PORT = Number(process.env.FASTAPI_PORT || 8001);
const FASTAPI_ORIGIN = `http://127.0.0.1:${FASTAPI_PORT}`;

let pythonProcess: ChildProcess | null = null;

function startFastApiServer(): void {
  if (pythonProcess) return;

  const pyPackagesDir = path.join(__dirname, 'backend', '.pypackages');
  const existingPythonPath = process.env.PYTHONPATH ? `:${process.env.PYTHONPATH}` : '';
  const env = {
    ...process.env,
    PYTHONPATH: `${pyPackagesDir}:${__dirname}${existingPythonPath}`,
  };

  pythonProcess = spawn(
    'python3',
    [
      '-m',
      'uvicorn',
      'backend.main:app',
      '--host',
      '127.0.0.1',
      '--port',
      String(FASTAPI_PORT),
      '--log-level',
      'warning',
    ],
    {
      cwd: __dirname,
      env,
      stdio: 'inherit',
    }
  );

  pythonProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[FastAPI] exited with code ${code}`);
    }
    pythonProcess = null;
  });
}

async function waitForFastApi(maxRetries = 30): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${FASTAPI_ORIGIN}/api/health`);
      if (res.ok) return;
    } catch {
      // FastAPI still booting
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  console.warn('[FastAPI] Backend did not respond before timeout; proxy will retry on demand.');
}

function cleanupPython(): void {
  if (pythonProcess) {
    pythonProcess.kill('SIGTERM');
    pythonProcess = null;
  }
}

process.on('SIGINT', () => {
  cleanupPython();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanupPython();
  process.exit(0);
});
process.on('exit', cleanupPython);

async function startServer(): Promise<void> {
  startFastApiServer();
  await waitForFastApi();

  const app = express();

  // Proxy all /api/* requests directly to Python FastAPI + SQLite on port 8001
  app.use('/api', express.raw({ type: '*/*', limit: '2mb' }), async (req, res) => {
    const targetUrl = `${FASTAPI_ORIGIN}${req.originalUrl}`;
    try {
      const headers: Record<string, string> = {};
      if (req.headers['content-type']) {
        headers['content-type'] = String(req.headers['content-type']);
      }
      if (req.headers['accept']) {
        headers['accept'] = String(req.headers['accept']);
      }

      const hasBody = !['GET', 'HEAD'].includes(req.method.toUpperCase());
      const upstream = await fetch(targetUrl, {
        method: req.method,
        headers,
        body:
          hasBody && Buffer.isBuffer(req.body) && req.body.length > 0
            ? new Uint8Array(req.body)
            : undefined,
      });

      const contentType = upstream.headers.get('content-type');
      if (contentType) {
        res.setHeader('content-type', contentType);
      }

      const arrayBuffer = await upstream.arrayBuffer();
      res.status(upstream.status).send(Buffer.from(arrayBuffer));
    } catch (err) {
      console.error('[Proxy -> FastAPI] Error:', err);
      res.status(502).json({
        detail: 'Python FastAPI backend is temporarily unavailable.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Portfolio server running at http://0.0.0.0:${PORT} (proxying /api -> Python FastAPI :${FASTAPI_PORT})`
    );
  });
}

startServer();
