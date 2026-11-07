import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const vehicles=JSON.parse(await readFile(new URL('../data/vehiculos.json',import.meta.url),'utf8'));
assert(vehicles.length>=3,'Se esperan al menos tres vehículos demo');
assert.equal(new Set(vehicles.map(x=>x.id)).size,vehicles.length,'IDs duplicados');
for(const v of vehicles){
  for(const key of ['id','marca','modelo','anio','kilometros','precio','combustible','cambio','carroceria','equipamiento','imagenes']) assert(v[key]!==undefined,`Falta ${key} en ${v.id}`);
  assert(v.precio>0 && v.kilometros>=0,`${v.id}: valores invalidos`);
  assert(v.imagenes.length>=5,`${v.id}: la galería debe contener >= 5 vistas`);
  assert(['Principal','Frontal','Trasera','Lateral','Interior','Volante'].every(t=>v.imagenes.some(p=>p.tipo===t)),`${v.id}: faltan vistas`);
  for(const item of v.imagenes){
    assert(item.src.startsWith('assets/') || item.src.startsWith('https://unsplash.com/photos/'),`URL no permitida en ${v.id}`);
    if(item.src.startsWith('assets/')) await access(new URL('../'+item.src,import.meta.url));
    if(item.fallback) await access(new URL('../'+item.fallback,import.meta.url));
  }
}
await access(new URL('../assets/frama-logo.png',import.meta.url));
console.log(`✓ JSON válido: ${vehicles.length} vehículos, galerías, campos técnicos y recursos locales comprobados.`);
