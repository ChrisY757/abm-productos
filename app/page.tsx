import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-8 sm:py-12 text-center w-full">
      <div className="w-full max-w-4xl bg-white p-8 sm:p-12 rounded-2xl shadow-md border border-slate-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl mb-6 text-4xl shadow-inner">
          📦
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Sistema de Gestión de Productos
        </h1>
        <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Plataforma para la administración en tiempo real de inventario.
          Permite realizar consultas con filtros dinámicos, altas, modificaciones
          y bajas consumiendo una API REST mediante arquitectura Next.js (App Router).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-left">
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-2">🔍 Filtros Rápidos</h2>
            <p className="text-base text-slate-600 leading-normal">
              Búsqueda en tiempo real por nombre y categoría conectada a la API.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-2">📝 ABM Completo</h2>
            <p className="text-base text-slate-600 leading-normal">
              Formulario reactivo reutilizable para crear y actualizar productos.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-2">⚡ React & Next.js</h2>
            <p className="text-base text-slate-600 leading-normal">
              Gestión de estado con useState, ciclo de vida con useEffect y componentes con props.
            </p>
          </div>
        </div>

        <Link
          href="/productos"
          className="inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-98"
        >
          <span>Ir a la Gestión de Productos</span>
          <span className="text-xl">&rarr;</span>
        </Link>
      </div>
    </main>
  );
}
