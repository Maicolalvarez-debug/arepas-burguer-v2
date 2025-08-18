export default function Home() {
  return (
    <main className="container">
      <section className="mt-8">
        <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-6 shadow-xl">
          <h1 className="text-3xl font-semibold">Bienvenido a Arepas Burguer</h1>
          <p className="mt-3 text-neutral-300 max-w-2xl">
            Escanea el QR en tu mesa o entra al menú para ordenar. Los pedidos llegan a WhatsApp.
          </p>
          <div className="mt-6 flex gap-3">
            <a className="btn-primary" href="/menu">Ver Menú</a>
            <a className="btn" href="/admin">Administración</a>
          </div>
        </div>
      </section>
    </main>
  );
}
