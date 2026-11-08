import type { Metadata } from "next";
import { Header, Footer, WhatsappFloating } from "@/components/frama/Shell";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "FRAMA AUTO · Importación y venta de vehículos", template: "%s | FRAMA AUTO" },
  description: "Catálogo de demostración FRAMA AUTO: vehículos, fichas técnicas y galerías. Todos los vehículos, imágenes y precios son ilustrativos.",
  robots: { index: false, follow: false }, icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><a href="#contenido" className="skip-link">Saltar al contenido</a><Header />{children}<Footer /><WhatsappFloating /></body></html>;
}
