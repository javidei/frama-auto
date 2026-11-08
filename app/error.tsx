"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main id="contenido" className="container error-page"><h1>No hemos podido cargar esta vista.</h1><p>Vuelve a intentarlo para continuar explorando.</p><button className="button gold" onClick={reset}>Reintentar</button><a href="/" className="button outline">Ir al inicio</a></main>; }
