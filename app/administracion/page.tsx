import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Administración · Hoja de ruta",
  description: "Plan técnico de FRAMA AUTO: base de datos, permisos y catálogo.",
  robots: { index: false, follow: false },
};

const groups = [
  {
    title: "01 · Base de datos y catálogo",
    description: "Pasar del JSON actual a un catálogo administrable.",
    tasks: [
      ["Crear proyecto de Supabase", "Configurar entornos, variables públicas y secretos en el servidor."],
      ["Modelar y conectar PostgreSQL", "Vehículos, fotografías, características, estados y usuarios autorizados."],
      ["Migrar los datos JSON", "Importar los vehículos de ejemplo y separar posteriormente el stock verificado."],
      ["Almacenamiento de imágenes", "Subida, orden y eliminación controlada de fotografías en Supabase Storage."],
    ],
  },
  {
    title: "02 · Autenticación y permisos",
    description: "La administración no podrá operar sin autorización real.",
    tasks: [
      ["Login con Supabase Auth", "Correo, contraseña, recuperación de cuenta y cierre de sesión."],
      ["Roles y seguridad RLS", "Distinguir administrador y editor con permisos comprobados en base de datos."],
      ["Autologin seguro", "Mantener la sesión iniciada de forma segura, con expiración y renovación de credenciales."],
      ["Proteger las rutas y operaciones", "Ninguna escritura pública ni claves privadas en el navegador."],
    ],
  },
  {
    title: "03 · Panel de gestión",
    description: "Herramientas que utilizará quien reciba permisos.",
    tasks: [
      ["CRUD de vehículos", "Crear, editar, publicar, reservar, marcar como vendido y archivar."],
      ["Gestión de galería", "Imagen principal, frontal, trasera, laterales, interior y volante."],
      ["Validación de fichas", "Campos obligatorios, precios, fotos, equipamiento y control de errores."],
      ["Historial de modificaciones", "Saber quién ha modificado cada vehículo y cuándo."],
    ],
  },
  {
    title: "04 · Puesta en producción",
    description: "Pasos antes de promocionar un inventario real.",
    tasks: [
      ["WhatsApp definitivo", "Sustituir el número ficticio por el número profesional autorizado."],
      ["Contacto y privacidad", "Canal real, protección antispam, avisos legales y gestión del consentimiento."],
      ["Copias de seguridad y supervisión", "Definir restauración, alertas y monitorización del servicio."],
      ["Despliegue y publicidad", "Dominio, hosting compatible con backend, SEO y Meta Pixel con consentimiento."],
    ],
  },
];

export default function AdministracionPage() {
  const count = groups.reduce((total, section) => total + section.tasks.length, 0);
  return <main id="contenido" className="admin-page"><div className="container">
    <header className="admin-heading">
      <p className="admin-eyebrow">FRAMA AUTO / ÁREA TÉCNICA</p>
      <h1>Administración <em>en construcción.</em></h1>
      <p className="admin-lead">Hoja de ruta para convertir el catálogo actual en un sistema con base de datos, edición de vehículos y acceso exclusivo para usuarios autorizados.</p>
      <div className="admin-meta"><span>Versión 0.1.2</span><span>Acceso público temporal</span><span>Solo planificación</span></div>
    </header>
    <section id="frama-vehicle-editor" aria-labelledby="vf-title"><p>Cargando administración de FRAMA AUTO…</p></section><script defer src="/frama-admin-console.js"></script>
    <section className="admin-notice" aria-label="Estado actual del área">
      <h2>Esta página todavía no requiere contraseña.</h2>
      <p>No existe un panel de edición ni login activo. Este listado es público y exclusivamente informativo; antes de gestionar datos reales se protegerá con Supabase Auth y permisos en servidor/base de datos.</p>
    </section>
    <section className="admin-notice" aria-label="Condiciones de Supabase Free">
      <h2>Primera fase con Supabase Free</h2>
      <p>Se puede comenzar gratis con límites de uso. Supabase puede <strong>pausar un proyecto Free con actividad insuficiente durante un período de siete días</strong>. Acceder al panel o realizar consultas reales ayuda a generar actividad, pero hacerlo una vez por semana no garantiza evitar la pausa. Para un catálogo comercial que deba estar siempre disponible, habrá que valorar el plan de pago y las copias de seguridad.</p>
      <p><a href="https://supabase.com/docs/guides/platform/free-project-pausing" target="_blank" rel="noopener noreferrer">Ver condiciones oficiales de Supabase</a></p>
    </section>
    <section aria-labelledby="backlog-title">
      <p className="admin-eyebrow">PLAN DE TRABAJO</p>
      <h2 id="backlog-title">Próximos desarrollos</h2>
      <div className="admin-progress" aria-label="Resumen de tareas"><div><strong>{count}</strong><span>Tareas definidas</span></div><div><strong>0</strong><span>Completadas</span></div><div><strong>0%</strong><span>Progreso registrado</span></div></div>
      <div className="admin-roadmap">{groups.map(group => <section className="admin-group" key={group.title}><h2>{group.title}</h2><p className="admin-group-intro">{group.description}</p>{group.tasks.map(([title, description]) => <div className="admin-task" key={title}><span aria-hidden="true" className="admin-task-circle"/><div><strong>{title}</strong><span>{description}</span></div><span className="admin-task-status">Pendiente</span></div>)}</section>)}</div>
    </section>
    <a className="admin-back" href="/">← Volver a FRAMA AUTO</a>
    <p className="admin-small">Hoja de ruta informativa · v0.1.2 · La edición y los permisos reales se implementarán en futuras versiones.</p>
  </div></main>;
}
