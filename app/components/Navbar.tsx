import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>📦</span> Sistema de Productos
          </span>
          <span className="text-xs bg-slate-800 text-slate-100 font-semibold px-2.5 py-1 rounded-md border border-slate-700 uppercase tracking-wider">
            Next.js ABM
          </span>
        </div>

        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="text-base font-semibold text-white hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            className="text-base font-semibold text-white hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            Gestión de Productos
          </Link>
        </nav>
      </div>
    </header>
  );
}
