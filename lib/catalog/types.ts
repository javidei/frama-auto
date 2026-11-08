export interface Vehicle {
  id: string; slug: string; demo: true; brand: string; model: string; trim: string; year: number; mileage: number; fuel: string; transmission: string; body: string; price: number; power: number; image: string; description: string;
  specs: Record<string, string>; equipment: Record<string, string[]>; gallery: { slot: number; label: string }[];
}
export interface CatalogRepository { list(): Promise<Vehicle[]>; findBySlug(slug: string): Promise<Vehicle | null>; }
