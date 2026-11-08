import { catalogRepository } from "@/lib/catalog/repository";
import { Home } from "@/components/frama/Home";
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  return <Home vehicles={await catalogRepository.list()} initialVehicle={typeof query.vehiculo === "string" ? query.vehiculo : ""} />;
}
