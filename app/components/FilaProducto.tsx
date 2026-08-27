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
    <tr className="border-b border-slate-200 hover:bg-indigo-50/40 transition-colors">
      <td className="p-4 font-mono text-base font-bold text-slate-800">
        {producto.codigo}
      </td>
      <td className="p-4 text-base font-semibold text-slate-900">
        {producto.nombre}
      </td>
      <td className="p-4">
        <span className="inline-block bg-slate-100 text-slate-800 text-sm px-3 py-1 rounded-md font-semibold border border-slate-200 shadow-2xs">
          {producto.categoria}
        </span>
      </td>
      <td className="p-4 text-right text-base font-extrabold text-slate-900 whitespace-nowrap">
        {Number(producto.precio).toLocaleString("es-PY")} Gs.
      </td>
      <td className="p-4 text-center">
        <span
          className={`inline-block text-sm font-bold px-3 py-1 rounded-md shadow-2xs ${
            producto.stock > 10
              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
              : producto.stock > 0
              ? "bg-amber-100 text-amber-900 border border-amber-200"
              : "bg-rose-100 text-rose-900 border border-rose-200"
          }`}
        >
          {producto.stock} un.
        </span>
      </td>
      <td className="p-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => onEditar(producto)}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-xs hover:shadow cursor-pointer"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(producto.codigo)}
            className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-xs hover:shadow cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}