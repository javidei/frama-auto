import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const basePath = process.env.FRAMA_PAGES_BASE ?? '/frama-auto';
if (!/^\/[a-zA-Z0-9_-]+$/.test(basePath) && basePath !== '') throw new Error('FRAMA_PAGES_BASE must be empty or one safe path segment.');
const work = path.join(root, 'work');
mkdirSync(work, { recursive: true });
const stage = mkdtempSync(path.join(work, 'pages-build-'));
for (const dir of ['app', 'components/frama', 'lib/catalog', 'data', 'public']) {
  cpSync(path.join(root, dir), path.join(stage, dir), { recursive: true,
    filter: entry => entry !== path.join(root, 'app', 'api') });
}
writeFileSync(path.join(stage, 'next.config.mjs'), `export default ${JSON.stringify({ output:'export', basePath, trailingSlash:true, images:{unoptimized:true}, experimental:{cpus:2} })};\n`);
writeFileSync(path.join(stage, 'postcss.config.mjs'), 'export default { plugins: { "@tailwindcss/postcss": {} } };\n');
writeFileSync(path.join(stage, 'package.json'), JSON.stringify({private:true,type:'module'}));
writeFileSync(path.join(stage, 'tsconfig.json'), JSON.stringify({compilerOptions:{target:'ES2017',lib:['dom','dom.iterable','esnext'],strict:true,noEmit:true,skipLibCheck:true,esModuleInterop:true,module:'esnext',moduleResolution:'bundler',resolveJsonModule:true,isolatedModules:true,jsx:'react-jsx',paths:{'@/*':['./*']}},include:['**/*.ts','**/*.tsx','.next/types/**/*.ts'],exclude:['node_modules']}));

// Plain anchors and public assets require an explicit repository prefix on GitHub Pages.
function prefix(content) {
  return content.replace(/(["'`])\/(images\/|vehiculos\/|#|\?|informacion|administracion|favicon\.svg)/g, (_, quote, suffix) => `${quote}${basePath}/${suffix}`)
    .replace(/(["'`])\/\1/g, (_, quote) => `${quote}${basePath}/${quote}`);
}
function walk(dir, callback) { for (const name of readdirSync(dir)) { const file=path.join(dir,name); if(statSync(file).isDirectory()) walk(file,callback); else callback(file); } }
walk(stage, file => { if(/\.(tsx|ts|json)$/.test(file) && !file.endsWith('tsconfig.json')) writeFileSync(file,prefix(readFileSync(file,'utf8'))); });
writeFileSync(path.join(stage,'app/page.tsx'), 'import { catalogRepository } from "@/lib/catalog/repository";\nimport { Home } from "@/components/frama/Home";\nexport default async function Page(){ return <Home vehicles={await catalogRepository.list()} />; }\n');
const detail=path.join(stage,'app/vehiculos/[slug]/page.tsx');
writeFileSync(detail, readFileSync(detail,'utf8')+'\nexport async function generateStaticParams(){ return (await catalogRepository.list()).map(v=>({slug:v.slug})); }\nexport const dynamicParams = false;\n');
const contact=path.join(stage,'components/frama/Contact.tsx');
let contactCode=readFileSync(contact,'utf8').replace('import { useState }','import { useEffect, useState }');
contactCode=contactCode.replace('  return <section', '  useEffect(() => { const slug = new URLSearchParams(location.search).get("vehiculo"); if(slug && vehicles.some(v => v.slug === slug)) setModel(slug); }, [vehicles]);\n  return <section');
writeFileSync(contact,contactCode);
// The Pages edition has no API server. Keep its explanation accurate.
const information=path.join(stage,'app/informacion/page.tsx');
writeFileSync(information,readFileSync(information,'utf8').replace('Las operaciones de administración están deshabilitadas en el servidor.', 'Esta publicación en GitHub Pages es estática: no tiene API de escritura ni panel de administración. La edición con servidor conserva esas operaciones deshabilitadas.'));

const result=spawnSync(process.execPath,[require.resolve('next/dist/bin/next'),'build',stage,'--webpack'],{cwd:root,stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
if(result.error) throw result.error;
if(result.status !== 0) process.exit(result.status ?? 1);
const output=path.join(stage,'out');
writeFileSync(path.join(output,'.nojekyll'),'');
const expected=['index.html','404.html','informacion/index.html','administracion/index.html','vehiculos/mercedes-benz-c200/index.html','vehiculos/bmw-320d/index.html','vehiculos/audi-q3-35-tfsi/index.html'];
for(const name of expected) if(!existsSync(path.join(output,name))) throw new Error(`Missing exported route: ${name}`);
walk(output,file=>{ if(file.endsWith('.html')) { const html=readFileSync(file,'utf8'); for(const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)/g)){const url=match[1];if(!url.startsWith(basePath+'/'))throw new Error(`Unprefixed URL: ${url}`);const local=decodeURIComponent(url.slice(basePath.length+1));if(local && !existsSync(path.join(output,local)))throw new Error(`Missing local asset: ${local}`);}} });
// Root is the existing Pages publishing source. Copy generated files beside the full source.
cpSync(output,root,{recursive:true});
console.log(`Pages export ready: ${basePath}/ (${expected.length} routes, local assets verified).`);
