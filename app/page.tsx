import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <span className="inline-block p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4 text-3xl">
          📦
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          Sistema de Gestión de Productos
        </h1>
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          Bienvenido al laboratorio de desarrollo web con Next.js (App Router).
          Esta aplicación consume una API REST en tiempo real para gestionar el
          inventario de productos con altas, bajas, modificaciones y filtros dinámicos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-1">🔍 Filtros Rápidos</h2>
            <p className="text-sm text-slate-500">
              Búsqueda por nombre y categoría conectada a la API.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-1">📝 ABM Completo</h2>
            <p className="text-sm text-slate-500">
              Formulario controlado para crear y editar productos.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-1">⚡ React & Next.js</h2>
            <p className="text-sm text-slate-500">
              Hooks useState, useEffect y componentes reutilizables con props.
            </p>
          </div>
        </div>

        <Link
          href="/productos"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm text-base"
        >
          Ir a la Gestión de Productos &rarr;
        </Link>
      </div>
    </main>
  );
}
