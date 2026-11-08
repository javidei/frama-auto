import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ficha de vehículo · FRAMA AUTO",
  description: "Ficha actualizada del catálogo de importación y venta de vehículos FRAMA AUTO.",
  robots: {index:false,follow:false}
};
export default function FichaPage(){
  return <main id="frama-live-detail" className="container frama-live-detail" aria-live="polite"><p className="frama-live-muted" style={{padding:"70px 0"}}>Cargando ficha de vehículo publicada…</p></main>;
}
