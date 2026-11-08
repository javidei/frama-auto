import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const base=process.env.FRAMA_PAGES_BASE ?? '/frama-auto';
const mime={'.html':'text/html; charset=utf-8','.txt':'text/plain; charset=utf-8','.json':'application/json','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname===base){res.writeHead(302,{Location:base+'/'}).end();return;}
 if(!pathname.startsWith(base+'/')){res.writeHead(404).end();return;}
 let file=path.resolve(root,'.'+pathname.slice(base.length));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(existsSync(file)&&statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!existsSync(file)){res.statusCode=404;file=path.join(root,'404.html');}
 res.setHeader('Content-Type',mime[path.extname(file)]??'application/octet-stream');createReadStream(file).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log(`http://127.0.0.1:4173${base}/`));
