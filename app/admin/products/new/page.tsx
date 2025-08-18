import React from 'react';
import { prisma } from '@/lib/prisma'; // ⬅️ ajusta si tu prisma está en otro path

export default async function NewProduct() {
  // Server Component async: permitido en Next 14
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <form
      id="form-with-autosave"
      className="card"
      action="/api/products"
      method="post"
      encType="multipart/form-data"
    >
      <h1>Nuevo producto</h1>

      <div className="mt-3">
        <input className="input" name="name" placeholder="Nombre" required />
      </div>

      <div className="mt-3">
        <input
          className="input"
          name="price"
          type="number"
          step="0.01"
          placeholder="Precio (número)"
          required
        />
      </div>

      <div className="mt-3">
        <select className="input" name="categoryId" required>
          <option value="">Selecciona una categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <input className="input" type="file" name="image" accept="image/*" />
      </div>

      <button className="btn mt-4" type="submit">
        Crear
      </button>
    </form>
  );
}
