'use client';
import { useEffect } from 'react';

export default function FormAutosave({ formId, storageKey }:{ formId:string; storageKey:string; }){
  useEffect(()=>{
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    const saved = localStorage.getItem(storageKey);
    if (saved){
      try{
        const data = JSON.parse(saved);
        Array.from(form.elements).forEach((el:any)=>{
          if (el.name && data[el.name] !== undefined){
            el.value = data[el.name];
          }
        });
      }catch{}
    }
    const onInput = () => {
      const obj:any = {};
      Array.from(form.elements).forEach((el:any)=>{
        if (el.name) obj[el.name] = el.value;
      });
      localStorage.setItem(storageKey, JSON.stringify(obj));
    };
    form.addEventListener('input', onInput);
    return ()=>form.removeEventListener('input', onInput);
  }, [formId, storageKey]);
  return null;
}
