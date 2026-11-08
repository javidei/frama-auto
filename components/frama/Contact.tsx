"use client";
import { useEffect, useMemo, useState } from "react";
import type { Vehicle } from "@/lib/catalog/types";
import { Icon } from "./Icon";

const ENDPOINT = "https://avboupigkstzprrgvlhr.supabase.co/functions/v1/frama-contact";
const KEY = "sb_publishable_eyFLhKFk9HXAab4q1cxG4A_-_la1-OI";

export function Contact({vehicles,initialVehicle=""}:{vehicles:Vehicle[];initialVehicle?:string}){
  const [model,setModel]=useState(vehicles.some(v=>v.slug===initialVehicle)?initialVehicle:"");
  const [published,setPublished]=useState<{slug:string;brand:string;model:string;trim?:string;commercial_status?:string}[]>([]);
  useEffect(()=>{
    const controller=new AbortController();
    const load=async()=>{
      try{
        const url="https://avboupigkstzprrgvlhr.supabase.co/rest/v1/frama_vehicles?select=slug,brand,model,trim,commercial_status&publication_status=eq.published&is_demo=eq.false&order=created_at.desc";
        const result=await fetch(url,{headers:{apikey:KEY,Accept:"application/json"},cache:"no-store",signal:controller.signal});
        if(result.ok){const rows=await result.json();if(Array.isArray(rows))setPublished(rows);}
      }catch(error){if(!controller.signal.aborted)console.warn("No se pudo actualizar el selector:",error);}
    };
    load();
    return ()=>controller.abort();
  },[]);
  const options=useMemo(()=>{
    const entries=new Map<string,{value:string;label:string}>();
    for(const v of vehicles){
      const label=[v.brand,v.model].filter(Boolean).join(" ").trim();
      if(label)entries.set(label.toLocaleLowerCase("es"),{value:v.slug,label});
    }
    for(const v of published){
      const name=[v.brand,v.model,v.trim].filter(Boolean).join(" ").trim();
      if(!name)continue;
      const label=name+(v.commercial_status==="en_importacion"?" (En importación)":"");
      entries.set(name.toLocaleLowerCase("es"),{value:v.slug,label});
    }
    return [...entries.values()];
  },[vehicles,published]);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [message,setMessage]=useState("");
  const [consent,setConsent]=useState(false);
  const [pending,setPending]=useState(false);
  const [status,setStatus]=useState("");
  const [error,setError]=useState(false);
  const interest=options.find(v=>v.value===model);
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(pending||!consent)return;
    setPending(true);setStatus("Enviando consulta…");setError(false);
    try{
      const response=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json","apikey":KEY},
      body:JSON.stringify({name,email,interest:interest?interest.label:"Una importación a medida",message})});
      const result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result.error||"No se ha podido enviar la consulta.");
      setStatus("Consulta enviada correctamente. Te responderemos lo antes posible.");
      setName("");setEmail("");setMessage("");setConsent(false);
    }catch(e){setError(true);setStatus(e instanceof Error?e.message:"No se ha podido enviar la consulta.");}
    finally{setPending(false);}
  }
  return <section id="contacto" className="contact section"><div className="container contact-layout">
    <div><p className="eyebrow">TU PRÓXIMO DESTINO</p><h2>Todo empieza<br/>con una conversación.</h2><p>Cuéntanos qué coche buscas y te responderemos por correo electrónico.</p></div>
    <form className="frama-contact-form" data-frama-contact="true" onSubmit={submit}>
      <div className="frama-contact-fields">
        <label><span>Tu nombre *</span><input name="name" autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} /></label>
        <label><span>Tu correo electrónico *</span><input name="email" type="email" autoComplete="email" required maxLength={180} value={email} onChange={e=>setEmail(e.target.value)} /></label>
      </div>
      <label><span>Me interesa</span><select value={model} onChange={e=>setModel(e.target.value)}>
        <option value="">Una importación a medida</option>{options.map(v=><option key={v.value} value={v.value}>{v.label}</option>)}
      </select></label>
      <label><span>¿Qué tienes en mente? *</span><textarea name="message" required minLength={10} maxLength={1200} rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Cuéntanos qué coche buscas…" /></label>
      <label className="consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)} />Acepto que FRAMA AUTO utilice mis datos para responder a esta consulta. <a href="/informacion/">Información y privacidad</a>.</label>
      <button type="submit" className="button gold" disabled={pending}>{pending?"Enviando…":"Enviar consulta"} <Icon name="arrow" size={17}/></button>
      {status&&<div className="frama-contact-result" data-error={String(error)} role="status">{status}</div>}
    </form>
  </div></section>;
}
