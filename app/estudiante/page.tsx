import Link from "next/link";

export default function EstudiantePage() {
  return (
    <main className="flex flex-col items-center justify-center py-6 sm:py-10 w-full">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        {/* Banner Superior */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar / Iniciales */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-indigo-600 border-4 border-white/20 shadow-xl flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
              CY
            </div>
            
            <div className="text-center sm:text-left space-y-1">
              <span className="inline-block bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-400/30">
                Perfil de Estudiante
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Christian Daniel Yegros Cabañas
              </h1>
              <p className="text-slate-300 text-base sm:text-lg font-medium">
                Cédula de Identidad: <span className="text-white font-bold">5.554.545</span>
              </p>
            </div>
          </div>
        </div>

        {/* Cuerpo de la Información */}
        <div className="p-8 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Carrera */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Carrera
              </span>
              <p className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>🎓</span> Ingeniería Informática
              </p>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                7mo Semestre
              </p>
            </div>

            {/* Institución */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Institución
              </span>
              <p className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>🏛️</span> Facultad Politécnica (FP-UNA)
              </p>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Universidad Nacional de Asunción
              </p>
            </div>

            {/* Materia */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Materia
              </span>
              <p className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>💻</span> Programación Web Frontend
              </p>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Laboratorio 1 — Next.js & API REST
              </p>
            </div>

            {/* Docente */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Docente
              </span>
              <p className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>👨‍🏫</span> Ing. Gustavo Sosa Cataldo
              </p>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Profesor de Cátedra
              </p>
            </div>
          </div>

          {/* Botones de Navegación */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-base"
            >
              &larr; Volver al Inicio
            </Link>

            <Link
              href="/productos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-base"
            >
              Ir a Gestión de Productos &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

