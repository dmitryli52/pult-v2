import http from 'node:http';
import { createReadStream, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 4174);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  let file = normalize(join(root, pathname === '/' ? 'index.html' : pathname));
  if (!file.startsWith(root + sep)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
    const stat = statSync(file);
    res.writeHead(200, {
      'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache'
    });
    createReadStream(file).pipe(res);
  } catch {
    try {
      const notFound = readFileSync(join(root, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': notFound.length, 'Cache-Control': 'no-cache' });
      res.end(notFound);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`ЛидПилот · полноэкранный пульт: http://127.0.0.1:${port}`);
});
