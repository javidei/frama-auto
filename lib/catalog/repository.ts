// Server-side entry point. A future SQL adapter must satisfy the same interface.
import data from "@/data/vehicles.json";
import type { CatalogRepository, Vehicle } from "./types";
const vehicles = data as Vehicle[];
export const catalogRepository: CatalogRepository = {
  async list() { return structuredClone(vehicles); },
  async findBySlug(slug) { return structuredClone(vehicles.find(v => v.slug === slug) ?? null); },
};
