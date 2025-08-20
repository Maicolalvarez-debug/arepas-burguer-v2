import Image from "next/image";
import Link from 'next/link';
export default function Home(){
  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-2xl font-bold">Bienvenido a Arepas Burguer</h1>
        <p className="opacity-80">Escanea el QR en tu mesa o entra al menú para ordenar. Los pedidos llegarán a WhatsApp.</p>
        <div className="mt-4 flex gap-2">
          <Link className="btn-primary" href="/menu">Ver Menú</Link>
          <Link className="btn" href="/admin">Administración</Link>
        </div>
      </div>
    </div>
  );
}
