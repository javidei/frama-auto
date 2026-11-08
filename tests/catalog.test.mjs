import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { filterVehicles, emptyFilters } from '../lib/catalog/filter.ts';
const vehicles = JSON.parse(readFileSync(new URL('../data/vehicles.json', import.meta.url)));
test('all demo records have unique routes, full specs and nine gallery views', () => {
  assert.equal(new Set(vehicles.map(v => v.slug)).size, vehicles.length);
  for (const v of vehicles) {
    assert.equal(v.demo, true); assert(v.price > 0); assert(Object.keys(v.specs).length >= 20);
    assert.deepEqual(v.gallery.map(p => p.slot), [0,1,2,3,4,5,6,7,8]);
    assert(existsSync(new URL(`../public${v.image}`, import.meta.url)));
  }
});
test('filters combine brand, budget and fuel without changing source data', () => {
  const result = filterVehicles(vehicles, {...emptyFilters, brand:'BMW', price:'35000', fuel:'Diésel'});
  assert.deepEqual(result.map(v => v.slug), ['bmw-320d']);
  assert.equal(filterVehicles(vehicles, {...emptyFilters, brand:'BMW', price:'30000'}).length, 0);
  assert.equal(vehicles[0].brand, 'Mercedes-Benz');
});
test('text search ignores casing and accents and empty state is real', () => {
  assert.equal(filterVehicles(vehicles, {...emptyFilters, search:'  MERCEDES  '}).length, 1);
  assert.equal(filterVehicles(vehicles, {...emptyFilters, search:'un coche inexistente'}).length, 0);
  assert.equal(filterVehicles(vehicles, emptyFilters).length, 3);
});
test('numeric sorting returns intended ordering', () => {
  assert.deepEqual(filterVehicles(vehicles,{...emptyFilters,sort:'price-asc'}).map(v=>v.price), [32900,35900,38900]);
  assert.equal(filterVehicles(vehicles,{...emptyFilters,sort:'year'})[0].year,2023);
});
