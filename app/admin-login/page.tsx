
'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AdminLogin(){
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get('next') || '/admin';

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password })});
    if(res.ok){
      router.push(next);
    } else {
      const j = await res.json().catch(()=>({message:'Error'}));
      setError(j.message || 'Contraseña incorrecta');
    }
  };

  return <div className="max-w-sm mx-auto">
    <h1 className="text-2xl font-semibold mb-4">Acceso de administrador</h1>
    <form onSubmit={submit} className="card space-y-3">
      <label className="label">Contraseña</label>
      <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Ingresa la contraseña" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button className="btn-primary" type="submit">Entrar</button>
    </form>
  </div>;
}
