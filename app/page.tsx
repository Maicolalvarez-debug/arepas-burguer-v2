import Link from 'next/link';
export default function Home(){
  return (
    <div className="card">
      <h1>Bienvenido a Arepas Burguer</h1>
      <p className="mt-2">Explora nuestro menú y arma tu pedido.</p>
      <div className="mt-3">
        <Link className="btn" href="/menu">Ir al Menú</Link>
      </div>
    </div>
  )
}
