'use client';
import { useEffect, useRef, useState } from 'react';

export default function AdminNotifier(){
  const [count, setCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(()=>{
    let prev = 0;
    const iv = setInterval(async ()=>{
      try{
        const res = await fetch('/api/orders?status=new');
        const js = await res.json();
        const n = js.count || 0;
        if (n > prev){
          if (audioRef.current){
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(()=>{});
          }
        }
        prev = n;
        setCount(n);
      }catch{}
    }, 10000);
    return ()=>clearInterval(iv);
  }, []);
  return <>
    <audio ref={audioRef} src="/notify.mp3" preload="auto"/>
    <div className="badge" style={{position:'fixed', right:12, bottom:12}}>Pedidos nuevos: {count}</div>
  </>;
}
