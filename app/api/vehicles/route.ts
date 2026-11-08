import { catalogRepository } from "@/lib/catalog/repository";
export async function GET() { return Response.json({ demo: true, vehicles: await catalogRepository.list() }, { headers: { "Cache-Control": "no-store" } }); }
