import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-indigo-400">
            📦 Sistema de Productos
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
            Next.js ABM
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-slate-300 hover:text-white transition-colors font-medium px-3 py-1.5 rounded hover:bg-slate-800"
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            className="text-slate-300 hover:text-white transition-colors font-medium px-3 py-1.5 rounded hover:bg-slate-800"
          >
            Gestión de Productos
          </Link>
        </nav>
      </div>
    </header>
  );
}

