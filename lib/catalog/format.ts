export const number = (n: number) => new Intl.NumberFormat("es-ES").format(n);
export const money = (n: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
