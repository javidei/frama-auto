export function CarImage({ image, slot = 0, label, eager = false }: { image: string; slot?: number; label: string; eager?: boolean }) {
  return <span className="car-image"><img src={image} alt={label} loading={eager ? "eager" : "lazy"} decoding="async" style={{ left: `${-(slot % 3) * 100}%`, top: `${-Math.floor(slot / 3) * 100}%` }} /></span>;
}
