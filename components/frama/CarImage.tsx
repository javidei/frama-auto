export function CarImage({ image, slot = 0, label, eager = false, source }: { image: string; slot?: number; label: string; eager?: boolean; source?: string }) {
  return <span className={source ? "car-image car-image-real" : "car-image"}><img src={source ?? image} alt={label} loading={eager ? "eager" : "lazy"} decoding="async" style={source ? undefined : { left: `${-(slot % 3) * 100}%`, top: `${-Math.floor(slot / 3) * 100}%` }} /></span>;
}
