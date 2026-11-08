import type { Vehicle } from "@/lib/catalog/types";
import { Gallery } from "./Gallery";
import { Icon } from "./Icon";
import { number } from "@/lib/catalog/format";
export function SoldVehicleDetail({ vehicle: v }: { vehicle: Vehicle }) {
  return <main id="contenido" className="detail container sold-detail"><nav className="breadcrumbs" aria-label="Ruta de navegación"><a href="/#vendidos">← Operaciones realizadas</a><span>/</span><span>{v.brand} {v.model}</span></nav>
    <div className="detail-heading"><div><p className="eyebrow">{v.brand} · EDICIÓN ESPECIAL</p><h1>{v.model}</h1><p>{v.trim}</p></div><span className="sold-header-status">VENDIDO</span></div>
    <div className="detail-layout"><Gallery vehicle={v} /><aside className="detail-summary sold-summary"><p className="eyebrow">OPERACIÓN REALIZADA</p><h2>Vendido.</h2><p>Este Volkswagen Golf GTI Edición Adidas ya tiene nuevo propietario. Conservamos la ficha y las fotografías como muestra de una venta realizada.</p>
      <div className="summary-specs"><div><span>Kilómetros</span><strong>{number(v.mileage)} km</strong></div><div><span>Potencia</span><strong>{v.power} CV</strong></div><div><span>Combustible</span><strong>{v.fuel}</strong></div><div><span>Cambio</span><strong>{v.transmission}</strong></div><div><span>Carrocería</span><strong>{v.body}</strong></div><div><span>Ubicación</span><strong>Palma del Río</strong></div></div>
      <a className="button gold" href="/#catalogo">Explorar otros vehículos <Icon name="arrow" size={17}/></a><p className="summary-disclaimer"><Icon name="info" size={18}/> Vehículo no disponible. Sin precio publicado porque es una venta finalizada.</p>
    </aside></div>
    <section className="detail-description"><p className="eyebrow">EDICIÓN ADIDAS</p><h2>Una edición <em>muy especial.</em></h2><p>{v.description}</p><p>En el anuncio de venta se indicaba entrega revisada, limpia y matriculada en España, con posibilidad de revisión mecánica en taller o concesionario a elección del comprador, por su cuenta. Estas condiciones corresponden a aquella venta, no a una oferta actual.</p></section>
    <section className="technical" aria-labelledby="technical-title"><h2 id="technical-title">Ficha del vehículo vendido</h2><p className="small-note">Información facilitada para el anuncio original; se conserva a título histórico.</p><dl className="spec-table">{Object.entries(v.specs).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></section>
    <section className="equipment"><h2>Equipamiento destacado</h2><div className="equipment-grid">{Object.entries(v.equipment).map(([group,items])=><article key={group}><h3>{group}</h3><ul>{items.map(item=><li key={item}><Icon name="check" size={17}/>{item}</li>)}</ul></article>)}</div></section>
    <a href="/#vendidos" className="button outline">← Más operaciones realizadas</a>
  </main>;
}
