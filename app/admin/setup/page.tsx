'use client';
import { useState } from 'react';

export default function SetupPage(){
  const [log, setLog] = useState<string>('');

  const call = async (path: string, label: string) => {
    setLog(prev => prev + `\n→ Ejecutando ${label}...`);
    const res = await fetch(path, { method: 'POST' });
    if (res.ok) {
      setLog(prev => prev + `\n✔ ${label} OK`);
    } else {
      const j = await res.json().catch(()=>({error:'Error desconocido'}));
      setLog(prev => prev + `\n✖ ${label} falló: ${j.error}`);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Configuración inicial</h1>
      <p className="text-gray-300">Desde aquí puedes cargar un menú de ejemplo y enlazar los adicionales a todos los productos. Luego podrás editar todo en el admin.</p>
      <div className="card space-y-2">
        <button className="btn-primary w-full" onClick={()=>call('/api/setup/seed', 'Cargar menú demo')}>Cargar menú demo</button>
        <button className="btn w-full" onClick={()=>call('/api/setup/link', 'Enlazar adicionales')}>Enlazar adicionales</button>
      </div>
      <pre className="card whitespace-pre-wrap text-sm">{log || 'Sin acciones aún.'}</pre>
    </div>
  );
}
