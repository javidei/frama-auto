import type { Vehicle } from "./types";
export const emptyFilters = { search: "", brand: "", fuel: "", body: "", price: "", transmission: "", sort: "featured" };
export type Filters = typeof emptyFilters;
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
export function filterVehicles(vehicles: Vehicle[], f: Filters): Vehicle[] {
  const result = vehicles.filter(v => (!f.search || normalize(`${v.brand} ${v.model} ${v.trim}`).includes(normalize(f.search))) && (!f.brand || v.brand === f.brand) && (!f.fuel || v.fuel === f.fuel) && (!f.body || v.body === f.body) && (!f.transmission || v.transmission === f.transmission) && (!f.price || v.price <= Number(f.price)));
  return result.sort((a, b) => f.sort === "price-asc" ? a.price - b.price : f.sort === "price-desc" ? b.price - a.price : f.sort === "year" ? b.year - a.year : f.sort === "mileage" ? a.mileage - b.mileage : 0);
}
