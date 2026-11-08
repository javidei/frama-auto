// Fail closed until real authentication, server-side authorization and persistence exist.
function disabled() { return Response.json({ error: "Administración deshabilitada en esta demostración." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
export const GET = disabled; export const POST = disabled; export const PUT = disabled; export const PATCH = disabled; export const DELETE = disabled;
