import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { filterVehicles, emptyFilters } from '../lib/catalog/filter.ts';
const vehicles = JSON.parse(readFileSync(new URL('../data/vehicles.json', import.meta.url)));
test('all demo records have unique routes, full specs and nine gallery views', () => {
  assert.equal(new Set(vehicles.map(v => v.slug)).size, vehicles.length);
  for (const v of vehicles.filter(v => v.demo)) {
    assert.equal(v.demo, true); assert(v.price > 0); assert(Object.keys(v.specs).length >= 20);
    assert.deepEqual(v.gallery.map(p => p.slot), [0,1,2,3,4,5,6,7,8]);
    assert(existsSync(new URL(`../public${v.image}`, import.meta.url)));
  }
});
test('filters combine brand, budget and fuel without changing source data', () => {
  const result = filterVehicles(vehicles.filter(v => v.demo), {...emptyFilters, brand:'BMW', price:'35000', fuel:'Diésel'});
  assert.deepEqual(result.map(v => v.slug), ['bmw-320d']);
  assert.equal(filterVehicles(vehicles, {...emptyFilters, brand:'BMW', price:'30000'}).length, 0);
  assert.equal(vehicles[0].brand, 'Mercedes-Benz');
});
test('text search ignores casing and accents and empty state is real', () => {
  assert.equal(filterVehicles(vehicles.filter(v => v.demo), {...emptyFilters, search:'  MERCEDES  '}).length, 1);
  assert.equal(filterVehicles(vehicles, {...emptyFilters, search:'un coche inexistente'}).length, 0);
  assert.equal(filterVehicles(vehicles.filter(v => v.demo), emptyFilters).length, 3);
});
test('numeric sorting returns intended ordering', () => {
  assert.deepEqual(filterVehicles(vehicles.filter(v => v.demo),{...emptyFilters,sort:'price-asc'}).map(v=>v.price), [32900,35900,38900]);
  assert.equal(filterVehicles(vehicles,{...emptyFilters,sort:'year'})[0].year,2023);
});

test('sold Golf Adidas has real photos, no fabricated price or year, and privacy-safe routes', () => {
  const v = vehicles.find(v => v.slug === 'volkswagen-golf-gti-mk6-adidas');
  assert(v); assert.equal(v.demo, false); assert.equal(v.status, 'vendido');
  assert.equal(v.price, null); assert.equal(v.year, null);
  assert.equal(v.mileage, 123000); assert.equal(v.power, 211);
  assert.equal(v.gallery.length, 7);
  for(const p of v.gallery) assert(existsSync(new URL(`../public${p.src}`,import.meta.url)));
});
