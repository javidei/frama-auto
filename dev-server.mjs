import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
const root = resolve('.');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
createServer(async (req,res) => {
  let pathname;
  try {pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);} catch {res.writeHead(400).end();return;}
  let file = resolve(root, '.'+pathname);
  if (!(file===root || file.startsWith(root+sep))) {res.writeHead(403).end();return;}
  try {
    if ((await stat(file)).isDirectory()) file=resolve(file,'index.html');
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(bytes);
  } catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('No encontrado');}
}).listen(port,()=>console.log(`FRAMA AUTO en http://localhost:${port}`));
