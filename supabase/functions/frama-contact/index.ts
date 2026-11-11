import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// FRAMA AUTO: envío de consultas desactivado a petición del propietario.
// Mantener la ruta temporalmente permite responder correctamente a clientes con una versión antigua de la web.
const origins=new Set(["https://javidei.github.io","http://localhost:3000","http://127.0.0.1:3000"]);
Deno.serve((request:Request)=>{
 const origin=request.headers.get("origin")||"";
 if(!origins.has(origin))return new Response("Forbidden",{status:403});
 const headers={"Content-Type":"application/json","Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"content-type,apikey,authorization","Vary":"Origin","Cache-Control":"no-store"};
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
 return new Response(JSON.stringify({ok:false,error:"El formulario de contacto de FRAMA AUTO está desactivado."}),{status:410,headers});
});
