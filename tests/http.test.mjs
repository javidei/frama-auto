import test from 'node:test';
import assert from 'node:assert/strict';
const base=process.env.FRAMA_TEST_URL || 'http://localhost:5173';
test('server-rendered pages and local assets are reachable', async () => {
  for (const path of ['/', '/vehiculos/mercedes-benz-c200', '/vehiculos/bmw-320d', '/vehiculos/audi-q3-35-tfsi', '/informacion', '/images/hero.png', '/images/logo-original.png', '/images/mercedes.png', '/images/bmw.png', '/images/audi.png']) {
    const response=await fetch(base+path); assert.equal(response.status,200,path); await response.arrayBuffer();
  }
});
test('API exposes demo only, returns 404 for unknown slug and rejects public writes', async () => {
  const response=await fetch(base+'/api/vehicles'); const data=await response.json();
  assert.equal(data.demo,true); assert.equal(data.vehicles.length,3);
  assert.equal((await fetch(base+'/api/vehicles/no-existe')).status,404);
  const detail=await (await fetch(base+'/api/vehicles/bmw-320d')).json(); assert.equal(detail.vehicle.brand,'BMW');
  assert.equal((await fetch(base+'/api/vehicles',{method:'POST',body:'{}'})).status,405);
});
test('administration fails closed even when the client claims to be an owner', async () => {
  for(const method of ['GET','POST','PUT','PATCH','DELETE']) {
    const response=await fetch(base+'/api/admin/vehicles',{method,headers:{'x-role':'owner','Authorization':'Bearer fake'}});
    assert.equal(response.status,503,method); assert.match((await response.json()).error,/deshabilitada/);
  }
});
test('missing vehicle has a usable recovery page', async () => {
  const response=await fetch(base+'/vehiculos/no-existe'); assert.equal(response.status,404);
  assert.match(await response.text(),/Volver al catálogo/);
});
test('a vehicle inquiry is preselected by the server without waiting for browser hydration', async () => {
  const response=await fetch(base+'/?vehiculo=audi-q3-35-tfsi');
  assert.match(await response.text(), /value="audi-q3-35-tfsi" selected=""/);
});
