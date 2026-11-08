import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Administración · Hoja de ruta",
  description: "Plan técnico de FRAMA AUTO: base de datos, permisos y catálogo.",
  robots: { index: false, follow: false },
};

import todo from "@/data/development-todo.json";
const groups=todo.groups;
const allTasks=groups.flatMap(g=>g.tasks);
const completed=allTasks.filter(t=>t.status==="hecho").length;
const inProgress=allTasks.filter(t=>t.status==="en_curso").length;
const percentage=Math.round(completed*100/allTasks.length);
const labels:Record<string,string>={hecho:"Hecho",en_curso:"En curso",pendiente:"Pendiente"};

export default function AdministracionPage() {
  const count = allTasks.length;
  return <main id="contenido" className="admin-page"><div className="container">
    <header className="admin-heading">
      <p className="admin-eyebrow">FRAMA AUTO / ÁREA TÉCNICA</p>
      <h1>Administración <em>en construcción.</em></h1>
      <p className="admin-lead">Gestión de vehículos y seguimiento de tareas completadas, en curso y pendientes.</p>
      <div className="admin-meta"><span>Versión {todo.version}</span><span>Actualizado 08/11/2026</span><span>Seguimiento de desarrollo</span></div>
    </header>
    <section id="frama-vehicle-editor" aria-labelledby="vf-title"><p>Cargando administración de FRAMA AUTO…</p></section><script defer src="/frama-admin-console.js?v=0.1.5"></script>
    <section className="admin-notice" aria-label="Estado actual del área">
      <h2>Estado real del catálogo</h2>
      <p>Existe código de login y edición conectado a Supabase, pero faltan pruebas completas. La web pública consulta los vehículos publicados de Supabase y sus fotografías. Queda comprobar el flujo completo de guardar y ver la actualización.</p>
    </section>
    <section className="admin-notice" aria-label="Condiciones de Supabase Free">
      <h2>Primera fase con Supabase Free</h2>
      <p>Se puede comenzar gratis con límites de uso. Supabase puede <strong>pausar un proyecto Free con actividad insuficiente durante un período de siete días</strong>. Acceder al panel o realizar consultas reales ayuda a generar actividad, pero hacerlo una vez por semana no garantiza evitar la pausa. Para un catálogo comercial que deba estar siempre disponible, habrá que valorar el plan de pago y las copias de seguridad.</p>
      <p><a href="https://supabase.com/docs/guides/platform/free-project-pausing" target="_blank" rel="noopener noreferrer">Ver condiciones oficiales de Supabase</a></p>
    </section>
    <section aria-labelledby="backlog-title">
      <p className="admin-eyebrow">PLAN DE TRABAJO</p>
      <h2 id="backlog-title">TO DO de desarrollo</h2>
      <div className="admin-progress" aria-label="Resumen de tareas"><div><strong>{completed} / {count}</strong><span>Completadas</span></div><div><strong>{inProgress}</strong><span>En curso</span></div><div><strong>{percentage}%</strong><span>Progreso terminado</span></div></div>
      <div className="admin-roadmap">{groups.map(group => <section className="admin-group" key={group.title}><h2>{group.title}</h2><p className="admin-group-intro">{group.description}</p>{group.tasks.map(task => <div className={"admin-task admin-task-" + task.status} key={task.title}><span aria-hidden="true" className="admin-task-circle"/><div><strong>{task.title}</strong><span>{task.description}</span></div><span className={"admin-task-status admin-task-status-" + task.status}>{labels[task.status]}</span></div>)}</section>)}</div>
    </section>
    <a className="admin-back" href="/">← Volver a FRAMA AUTO</a>
    <p className="admin-small">Seguimiento v{todo.version} · El estado en curso no se considera terminado.</p>
  </div></main>;
}
