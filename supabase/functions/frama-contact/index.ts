import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const PROJECT = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM = Deno.env.get("FRAMA_FROM_EMAIL") ?? "";
const origins = new Set(["https://javidei.github.io","http://localhost:3000","http://127.0.0.1:3000"]);
const recent = new Map<string,number[]>();
function json(status:number,data:unknown,origin:string) {
  return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"content-type,apikey,authorization","Vary":"Origin","Cache-Control":"no-store"}});
}
function safe(s:unknown,max:number){return typeof s==="string"?s.trim().slice(0,max):"";}
Deno.serve(async(req:Request)=>{
  const origin=req.headers.get("origin")||"";
  const cors=origins.has(origin)?origin:"";
  if(!cors)return new Response("Forbidden",{status:403});
  if(req.method==="OPTIONS")return json(200,{ok:true},cors);
  if(req.method!=="POST")return json(405,{error:"Método no permitido."},cors);
  try {
    const size=Number(req.headers.get("content-length")||0);
    if(size>10000)return json(413,{error:"Mensaje demasiado largo."},cors);
    const body=await req.json();
    if(body.website)return json(200,{ok:true},cors); // honeypot: bots are ignored
    const name=safe(body.name,100),email=safe(body.email,180),interest=safe(body.interest,180),message=safe(body.message,1200);
    if(name.length<2||!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||message.length<10||message.length>1200)
      return json(400,{error:"Revisa nombre, correo y mensaje (mínimo 10 caracteres)."},cors);
    const ip=(req.headers.get("cf-connecting-ip")||req.headers.get("x-real-ip")||"unknown").slice(0,90);
    const now=Date.now(),windowMs=3600_000;
    for(const [key,vals] of recent) {const left=vals.filter(t=>now-t<windowMs);if(left.length)recent.set(key,left);else recent.delete(key);}
    const hits=recent.get(ip)||[];
    if(hits.length>=5)return json(429,{error:"Demasiadas solicitudes. Inténtalo más tarde."},cors);
    hits.push(now);recent.set(ip,hits);
    if(!RESEND_KEY||!FROM||!PROJECT||!SERVICE_KEY)
      return json(503,{error:"El envío de correo aún no está activado. Contacta con FRAMA AUTO por otra vía."},cors);
    const cfg=await fetch(PROJECT+"/rest/v1/frama_contact_settings?id=eq.1&select=email",{
      headers:{apikey:SERVICE_KEY,Authorization:"Bearer "+SERVICE_KEY},cache:"no-store"
    });
    if(!cfg.ok)throw new Error("Settings unavailable");
    const settings=await cfg.json();
    const recipient=settings?.[0]?.email;
    if(typeof recipient!=="string"||!recipient.includes("@"))throw new Error("Missing recipient");
    const htmlEscape=(v:string)=>v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
    const res=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+RESEND_KEY,"Content-Type":"application/json"},body:JSON.stringify({
      from:FROM,to:[recipient],reply_to:email,subject:"Consulta web FRAMA AUTO: "+interest.slice(0,70),
      text:"Nombre: "+name+"\nCorreo: "+email+"\nInterés: "+interest+"\n\n"+message,
      html:"<h2>Nueva consulta de FRAMA AUTO</h2><p><b>Nombre:</b> "+htmlEscape(name)+"</p><p><b>Correo:</b> "+htmlEscape(email)+"</p><p><b>Interés:</b> "+htmlEscape(interest)+"</p><p style='white-space:pre-wrap'>"+htmlEscape(message)+"</p>"
    })});
    if(!res.ok){console.error("Resend:",res.status);return json(502,{error:"No se ha podido entregar el mensaje. Inténtalo más tarde."},cors);}
    return json(200,{ok:true,message:"Mensaje enviado correctamente."},cors);
  }catch(e){console.error("frama-contact error",e instanceof Error?e.message:"unknown");return json(500,{error:"No se ha podido enviar el mensaje."},cors);}
});
