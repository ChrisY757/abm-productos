"use client";

import type { Producto } from "../types/Producto";

type Props = {
  producto: Producto;
  onEditar: (producto: Producto) => void;
  onEliminar: (codigo: string) => void;
};

export default function FilaProducto({
  producto,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
      <td className="p-3.5 font-mono text-sm font-semibold text-slate-700">
        {producto.codigo}
      </td>
      <td className="p-3.5 font-medium text-slate-900">
        {producto.nombre}
      </td>
      <td className="p-3.5">
        <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-200">
          {producto.categoria}
        </span>
      </td>
      <td className="p-3.5 text-right font-medium text-slate-800">
        {Number(producto.precio).toLocaleString("es-PY")} Gs.
      </td>
      <td className="p-3.5 text-center">
        <span
          className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
            producto.stock > 10
              ? "bg-emerald-100 text-emerald-800"
              : producto.stock > 0
              ? "bg-amber-100 text-amber-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {producto.stock} u.
        </span>
      </td>
      <td className="p-3.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEditar(producto)}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(producto.codigo)}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}