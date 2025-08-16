'use client';
import { useState } from 'react';
export default function LoginPage(){
  const [password, setPassword] = useState(""); const [err, setErr] = useState("");
  const submit = async (e:React.FormEvent)=>{
    e.preventDefault(); setErr("");
    const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ password }) });
    if (res.ok){ window.location.href = "/admin"; } else { const j = await res.json().catch(()=>({error:"Error"})); setErr(j.error || "Error"); }
  };
  return (<div className="max-w-sm mx-auto"><h1 className="text-2xl font-semibold mb-4">Ingresar al Admin</h1>
    <form onSubmit={submit} className="space-y-3">
      <input className="input" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
      {err && <div className="text-sm text-red-400">{err}</div>}
      <button className="btn-primary w-full">Entrar</button>
    </form></div>);
}
