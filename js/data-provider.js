/**
 * FRAMA AUTO - Capa de datos intercambiable.
 * Hoy: JSON local. Mañana: API REST/GraphQL que consulte PostgreSQL.
 * El navegador nunca debe conectarse directamente a la BBDD con credenciales privilegiadas.
 */
export async function getVehicles() {
  const url = new URL('../data/vehiculos.json', import.meta.url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`No se pudo cargar el catálogo (HTTP ${response.status})`);
  const vehicles = await response.json();
  if (!Array.isArray(vehicles)) throw new Error('Formato de catálogo incorrecto');
  return vehicles;
}
