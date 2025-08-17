'use client'; import { useEffect, useState } from 'react'; import { useRouter } from 'next/navigation';
export default function CategoryForm({ id }:{ id?: number }){ const router = useRouter(); const [name,setName]=useState('');
  useEffect(()=>{ if (!id) return; (async()=>{ const j=await fetch(`/api/categories/${id}`).then(r=>r.json()); setName(j.name||''); })(); },[id]);
  const save=async(e:React.FormEvent)=>{ e.preventDefault(); const method=id?'PUT':'POST'; const url=id?`/api/categories/${id}`:'/api/categories';
    const res=await fetch(url,{ method, headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) }); if(res.ok) router.push('/admin/categories'); };
  return (<div className='max-w-sm'><h1 className='text-2xl font-semibold mb-4'>{id?'Editar':'Nueva'} categoría</h1><form onSubmit={save} className='space-y-3'>
    <label className='label'>Nombre</label><input className='input' value={name} onChange={e=>setName(e.target.value)} placeholder='Ej. Hamburguesas'/>
    <button className='btn-primary'>Guardar</button></form></div>); }