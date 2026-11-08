import type { Vehicle } from "@/lib/catalog/types";
import { CarImage } from "./CarImage";
import { Icon } from "./Icon";
import { number } from "@/lib/catalog/format";
export function SoldVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  if (!vehicles.length) return null;
  return <section id="vendidos" className="sold-section section"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">NUESTRA TRAYECTORIA</p><h2>Vehículos que ya <em>han encontrado dueño.</em></h2></div><p>Algunas de las operaciones realizadas.<br />Historias de coches que ya están en buenas manos.</p></div>
    <div className="sold-grid">{vehicles.map(v => <a className="sold-vehicle-card" key={v.id} href={`/vehiculos/${v.slug}`}>
      <div className="sold-vehicle-image"><CarImage image={v.image} source={v.gallery[0]?.src} label={`${v.brand} ${v.model} ${v.trim}: unidad vendida`} /><span className="sold-status">VENDIDO</span></div>
      <div className="sold-vehicle-info"><span className="eyebrow">{v.brand} · OPERACIÓN REALIZADA</span><h3>{v.model}</h3><p>{v.trim}</p><div className="sold-specs"><span>{number(v.mileage)} km</span><span>{v.power} CV</span><span>{v.transmission}</span></div><span className="sold-cta">Ver operación y fotografías <Icon name="arrow" size={16} /></span></div>
    </a>)}</div>
  </div></section>;
}
