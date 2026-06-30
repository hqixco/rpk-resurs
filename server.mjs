import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 8080);
const distDir = join(process.cwd(), 'dist');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.htm': 'text/html; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  return normalized === '\\' || normalized === '/' ? '/index.html' : normalized;
}

async function resolveFile(urlPath) {
  const requestedPath = safePath(urlPath);
  const fullPath = join(distDir, requestedPath);

  if (existsSync(fullPath)) {
    const fileStat = await stat(fullPath);
    if (fileStat.isFile()) return fullPath;
  }

  return join(distDir, 'index.html');
}

createServer(async (req, res) => {
  try {
    const filePath = await resolveFile(req.url || '/');
    const extension = extname(filePath).toLowerCase();
    const isAsset = filePath !== join(distDir, 'index.html');

    res.writeHead(200, {
      'Cache-Control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
    });

    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Static server listening on ${port}`);
});
