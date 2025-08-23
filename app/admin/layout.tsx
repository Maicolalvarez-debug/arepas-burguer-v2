'use client'
import { useEffect, useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark'|'light'>(()=> (typeof window!=='undefined' && (localStorage.getItem('theme') as any)) || 'dark')
  useEffect(()=>{
    if (typeof window==='undefined') return
    localStorage.setItem('theme', theme)
  }, [theme])

  const isDark = theme==='dark'
  return (
    <div className={isDark ? 'min-h-screen bg-gray-950 text-white' : 'min-h-screen bg-gray-900 text-black'}>
      <div className={isDark ? 'sticky top-0 z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60' : 'sticky top-0 z-10 border-b bg-gray-900/80 backdrop-blur'}>
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="font-semibold">Admin</div>
          <button
            className="border rounded px-3 py-1"
            onClick={()=> setTheme(isDark ? 'light' : 'dark')}
          >
            Tema: {isDark ? 'Oscuro' : 'Claro'}
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  )
}
