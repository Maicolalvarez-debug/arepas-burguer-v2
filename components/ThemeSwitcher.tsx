'use client';
import { useEffect, useState } from 'react';

export default function ThemeSwitcher(){
  const [color, setColor] = useState('#eab308');
  useEffect(()=>{
    const saved = localStorage.getItem('primary') || '#eab308';
    setColor(saved);
    if (typeof document !== 'undefined') document.documentElement.style.setProperty('--primary', saved);
  }, []);
  return (
    <div className="flex items-center gap-2">
      <span style={{fontSize:12, opacity:.8}}>Color:</span>
      <input type="color" value={color} onChange={(e)=>{
        const v = e.target.value;
        setColor(v);
        localStorage.setItem('primary', v);
        if (typeof document !== 'undefined') document.documentElement.style.setProperty('--primary', v);
      }}/>
    </div>
  );
}
