export interface Vehicle {
  id: string; slug: string; demo: boolean; status?: "publicado" | "vendido" | "borrador"; brand: string; model: string; trim: string; year: number | null; mileage: number; fuel: string; transmission: string; body: string; price: number | null; power: number; image: string; description: string;
  specs: Record<string, string>; equipment: Record<string, string[]>; gallery: { slot: number; label: string; src?: string }[];
}
export interface CatalogRepository { list(): Promise<Vehicle[]>; findBySlug(slug: string): Promise<Vehicle | null>; }
